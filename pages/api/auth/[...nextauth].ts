/* eslint-disable @typescript-eslint/ban-ts-comment */
import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import TwitchProvider from 'next-auth/providers/twitch';
import CredentialsProvider from 'next-auth/providers/credentials';
import { NextApiRequest, NextApiResponse } from 'next';
import { isAxiosError } from 'axios';
import { MongoDBAdapter } from '@next-auth/mongodb-adapter';

import clientPromise from '../../../lib/mongodb';
import { connectToDatabase } from '../../../middleware/database';
import {
    parseAsArrayOfCommerceLayerErrors,
    parseAsArrayOfCommerceResponse,
    parseAsNumber,
    parseAsString,
    safelyParse,
} from '../../../utils/parsers';
import { authClient, userClient } from '../../../utils/auth';
import { gaEvent } from '../../../utils/ga';

const isDev = process.env.NODE_ENV === 'development';
const databaseName = isDev ? 'kingofcardboard' : 'kingofcardboard_live';

export default async function auth(req: NextApiRequest, res: NextApiResponse): Promise<void> {
    return await NextAuth(req, res, {
        // Configure one or more authentication providers
        providers: [
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            CredentialsProvider({
                // The name to display on the sign in form (e.g. 'Sign in with...')
                name: 'credentials',
                // The credentials is used to generate a suitable form on the sign in page.
                // You can specify whatever fields you are expecting to be submitted.
                // e.g. domain, username, password, 2FA token, etc.
                // You can pass any HTML attribute to the <input> tag through the object.
                credentials: {
                    emailAddress: { label: 'Email Address', type: 'text', placeholder: 'Email' },
                    password: { label: 'Password', type: 'password' },
                },
                async authorize(credentials) {
                    // You need to provide your own logic here that takes the credentials
                    // submitted and returns either a object representing a user or value
                    // that is false/null if the credentials are invalid.
                    // e.g. return { id: 1, name: 'J Smith', email: 'jsmith@example.com' }
                    // You can also use the `req` object to obtain additional parameters
                    // (i.e., the request IP address)
                    const { db } = await connectToDatabase();
                    const collection = db.collection('credentials');

                    const emailAddress = safelyParse(credentials, 'emailAddress', parseAsString, null);
                    const password = safelyParse(credentials, 'password', parseAsString, null);

                    if (!emailAddress || !password) {
                        throw new Error('Must provider an email and password');
                    }

                    try {
                        const tokenRes = await userClient().post('/oauth/token', {
                            grant_type: 'password',
                            username: emailAddress,
                            password,
                            client_id: process.env.NEXT_PUBLIC_ECOM_SALES_ID,
                            scope: process.env.NEXT_PUBLIC_MARKET,
                        });
                        const token = safelyParse(tokenRes, 'data.access_token', parseAsString, null);
                        const owner_id = safelyParse(tokenRes, 'data.owner_id', parseAsString, null);
                        const user = await collection.findOne({ emailAddress });

                        if (!user) {
                            const userDocument = {
                                username: '',
                                emailAddress,
                                commerceId: owner_id,
                            };

                            await collection.insertOne(userDocument);
                        }

                        if (token && owner_id && emailAddress) {
                            const values = {
                                $set: {
                                    commerceId: owner_id,
                                },
                            };

                            await collection.updateOne({ emailAddress }, values);

                            return { id: owner_id, email: emailAddress };
                        }

                        return null;
                    } catch (error) {
                        if (isAxiosError(error)) {
                            throw new Error(error.message);
                        } else {
                            throw new Error('Error');
                        }
                    }
                },
            }),
            GoogleProvider({
                clientId: process.env.GOOGLE_ID || '',
                clientSecret: process.env.GOOGLE_SECRET || '',
            }),
            /* TwitchProvider({
                clientId: process.env.TWITCH_CLIENT_ID || '',
                clientSecret: process.env.TWITCH_CLIENT_SECRET || '',
            }), */
        ],
        secret: process.env.JWT_SECRET,
        session: {
            // Choose how you want to save the user session.
            // The default is `"jwt"`, an encrypted JWT (JWE) in the session cookie.
            // If you use an `adapter` however, we default it to `"database"` instead.
            // You can still force a JWT session by explicitly defining `"jwt"`.
            // When using `"database"`, the session cookie will only contain a `sessionToken` value,
            // which is used to look up the session in the database.
            strategy: 'jwt',

            // Seconds - How long until an idle session expires and is no longer valid.
            maxAge: 30 * 24 * 60 * 60, // 30 days

            // Seconds - Throttle how frequently to write to database to extend a session.
            // Use it to limit write operations. Set to 0 to always update the database.
            // Note: This option is ignored if using JSON Web Tokens
            updateAge: 24 * 60 * 60, // 24 hours
        },
        jwt: {
            // A secret to use for key generation. Defaults to the top-level `secret`.
            secret: process.env.JWT_SECRET,
            // The maximum age of the NextAuth.js issued JWT in seconds.
            // Defaults to `session.maxAge`.
            maxAge: 60 * 60 * 24 * 30,
        },
        pages: {
            signIn: `${process.env.NEXT_PUBLIC_SITE_URL || ''}/account`,
            signOut: `${process.env.NEXT_PUBLIC_SITE_URL || ''}/login?signedOut=true`,
            error: `${process.env.NEXT_PUBLIC_SITE_URL || ''}/login`, // Error code passed in query string as ?error=
            newUser: `${process.env.NEXT_PUBLIC_SITE_URL || ''}/account`,
        },
        callbacks: {
            async signIn({ user, email, credentials }) {
                if (!credentials) {
                    const { db } = await connectToDatabase();

                    try {
                        const credsCollection = db.collection('credentials');
                        const profileCollection = db.collection('profile');
                        const achievementsCollection = db.collection('achievements');
                        const clientTokenRes = await authClient().post('/oauth/token', {
                            grant_type: 'client_credentials',
                            client_id: process.env.ECOM_CLIENT_ID,
                            client_secret: process.env.ECOM_CLIENT_SECRET,
                            scope: process.env.NEXT_PUBLIC_MARKET,
                        });
                        const token = safelyParse(clientTokenRes, 'data.access_token', parseAsString, null);
                        const cl = authClient(token);
                        const emailAddress = safelyParse(user, 'email', parseAsString, null);

                        if (emailAddress) {
                            const creds = await credsCollection.findOne({ emailAddress });
                            const profile = await profileCollection.findOne({ emailAddress });
                            const achievements = await achievementsCollection.findOne({ emailAddress });
                            const hasAchievements = Boolean(achievements);

                            gaEvent('login', { email: emailAddress });

                            // Reserve credentials when a user signs in if they don't exist.
                            if (!creds) {
                                const userDocument = {
                                    username: user.name,
                                    emailAddress,
                                };

                                await credsCollection.insertOne(userDocument);
                            }

                            // Setup a blank profile if the user is signing in for the first time.
                            if (!profile) {
                                const profileDocument = {
                                    emailAddress,
                                    instagram: '',
                                    twitter: '',
                                    twitch: '',
                                    youtube: '',
                                    ebay: '',
                                };

                                await profileCollection.insertOne(profileDocument);
                            }

                            // Set up achievements document if the user hasn't logged in before.
                            if (!hasAchievements && token) {
                                // Send a post requet to setup a draft gift card.
                                const draftGiftCard = await cl.post('/api/gift_cards', {
                                    data: {
                                        type: 'gift_cards',
                                        attributes: {
                                            currency_code: 'GBP',
                                            balance_cents: 0,
                                            single_use: false,
                                            rechargeable: true,
                                            recipient_email: email,
                                            reference: `${email}-reward-card`,
                                        },
                                    },
                                });

                                // Find the gift card id.
                                const giftCardId = safelyParse(draftGiftCard, 'data.data.id', parseAsString, null);

                                if (giftCardId) {
                                    // If the gift card id exists then purchase it.
                                    const purchasedGiftCard = await cl.patch(`/api/gift_cards/${giftCardId}`, {
                                        data: {
                                            type: 'gift_cards',
                                            id: giftCardId,
                                            attributes: {
                                                _purchase: true,
                                            },
                                        },
                                    });

                                    if (purchasedGiftCard) {
                                        // If the gift card has been purchased then activate it.
                                        const activatedGiftCard = await cl.patch(`/api/gift_cards/${giftCardId}`, {
                                            data: {
                                                type: 'gift_cards',
                                                id: giftCardId,
                                                attributes: {
                                                    _activate: true,
                                                },
                                            },
                                        });

                                        if (activatedGiftCard) {
                                            await achievementsCollection.insertOne({
                                                emailAddress: email,
                                                giftCardId,
                                            });
                                        }
                                    }
                                }
                            }

                            // Perform some further actions with our token.
                            if (token) {
                                // See if the customer already exists in commerce layer.
                                const customerData = await cl.get(`/api/customers?filter[q][email_eq]=${user.email}`);
                                const customerCount = safelyParse(
                                    customerData,
                                    'data.meta.record_count',
                                    parseAsNumber,
                                    0
                                );

                                // If the customer doesn't exist in Commerce Layer, create them.
                                if (customerCount <= 0) {
                                    const customer = await cl.post(`/api/customers`, {
                                        data: {
                                            type: 'customers',
                                            attributes: {
                                                email: user.email,
                                            },
                                        },
                                    });

                                    await credsCollection.updateOne(
                                        { emailAddress: user.email },
                                        {
                                            $set: {
                                                commerceId: safelyParse(customer, 'data.data.id', parseAsString, null),
                                            },
                                        }
                                    );
                                } else {
                                    const customer = safelyParse(
                                        customerData,
                                        'data.data',
                                        parseAsArrayOfCommerceResponse,
                                        null
                                    );

                                    if (customer) {
                                        await credsCollection.updateOne(
                                            { emailAddress: user.email },
                                            {
                                                $set: {
                                                    commerceId: safelyParse(customer[0], 'id', parseAsString, null),
                                                },
                                            }
                                        );
                                    }
                                }
                            }
                        }
                    } catch (error) {
                        const message = safelyParse(
                            error,
                            'response.data.errors',
                            parseAsArrayOfCommerceLayerErrors,
                            null
                        );

                        throw new Error(message ? message[0].detail : 'Error');
                    }
                }

                return true;
            },
            async session({ session }) {
                return session;
            },
            async jwt({ token }) {
                return token;
            },
        },
        adapter: MongoDBAdapter(clientPromise, { databaseName }),
        debug: false,
    });
}
