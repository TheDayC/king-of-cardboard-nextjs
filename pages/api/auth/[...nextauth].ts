/* eslint-disable @typescript-eslint/ban-ts-comment */
import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import TwitchProvider from 'next-auth/providers/twitch';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcrypt';
import { NextApiRequest, NextApiResponse } from 'next';

import { connectToDatabase } from '../../../middleware/database';
import { parseAsCommerceResponseArray, parseAsNumber, parseAsString, safelyParse } from '../../../utils/parsers';
import { authClient } from '../../../utils/auth';
import clientPromise from '../../../lib/mongodb';
import { MongoDBAdapter } from '../../../lib/mongoAdapter';

export default async function auth(req: NextApiRequest, res: NextApiResponse): Promise<void> {
    return await NextAuth(req, res, {
        // Configure one or more authentication providers
        providers: [
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            CredentialsProvider({
                // The name to display on the sign in form (e.g. 'Sign in with...')
                name: 'Credentials',
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
                    const { db, client } = await connectToDatabase();

                    try {
                        const { emailAddress, password } = JSON.parse(JSON.stringify(credentials));
                        const collection = db.collection('credentials');
                        const tokenRes = await authClient().post('/oauth/token', {
                            grant_type: 'client_credentials',
                            client_id: process.env.ECOM_CLIENT_ID,
                            client_secret: process.env.ECOM_CLIENT_SECRET,
                            scope: 'market:6098',
                        });
                        const token = safelyParse(tokenRes, 'data.access_token', parseAsString, null);
                        const cl = authClient(token);

                        if (emailAddress && password) {
                            const user = await collection.findOne({ emailAddress });

                            if (user) {
                                const match = await bcrypt.compare(password, user.password);

                                const customerData = await cl.get(
                                    `/api/customers?filter[q][email_eq]=${user.emailAddress}`
                                );
                                const customerCount = safelyParse(
                                    customerData,
                                    'data.meta.record_count',
                                    parseAsNumber,
                                    0
                                );

                                // If the customer exists ensure to add the id to the mongo db if it's missing.
                                if (customerCount > 0 && !user.commerceId) {
                                    const customer = safelyParse(
                                        customerData,
                                        'data.data',
                                        parseAsCommerceResponseArray,
                                        null
                                    );

                                    if (customer) {
                                        const values = {
                                            $set: {
                                                commerceId: safelyParse(customer[0], 'id', parseAsString, null),
                                            },
                                        };

                                        await collection.updateOne({ emailAddress }, values);
                                    }
                                }

                                if (match) {
                                    return { id: user._id, username: user.username, email: user.emailAddress };
                                }
                            }
                        }
                    } catch (err) {
                        console.log('🚀 ~ file: [...nextauth].ts ~ line 97 ~ authorize ~ err', err);
                        throw err;
                    }

                    return null;
                },
            }),
            GoogleProvider({
                clientId: process.env.GOOGLE_ID || '',
                clientSecret: process.env.GOOGLE_SECRET || '',
            }),
            TwitchProvider({
                clientId: process.env.TWITCH_CLIENT_ID || '',
                clientSecret: process.env.TWITCH_CLIENT_SECRET || '',
            }),
        ],
        secret: process.env.JWT_SECRET,
        /* jwt: {
            secret: process.env.JWT_ENCRYPT,
        }, */
        pages: {
            signIn: '/account',
            signOut: '/login?signedOut=true',
            error: '/login', // Error code passed in query string as ?error=
            newUser: '/account',
        },
        callbacks: {
            async signIn({ user, account, profile, email, credentials }) {
                if (!credentials) {
                    const { db, client } = await connectToDatabase();

                    try {
                        const tokenRes = await authClient().post('/oauth/token', {
                            grant_type: 'client_credentials',
                            client_id: process.env.ECOM_CLIENT_ID,
                            client_secret: process.env.ECOM_CLIENT_SECRET,
                            scope: 'market:6098',
                        });
                        const credsCollection = db.collection('credentials');
                        const profileCollection = db.collection('profile');
                        const achievementsCollection = db.collection('achievements');

                        const creds = await credsCollection.findOne({ emailAddress: user.email });
                        const profile = await profileCollection.findOne({ emailAddress: user.email });
                        const achievements = await achievementsCollection.findOne({ emailAddress: user.email });

                        const token = safelyParse(tokenRes, 'data.access_token', parseAsString, null);
                        const cl = authClient(token);

                        // Reserve credentials when a user signs in if they don't exist.
                        if (!creds) {
                            const userDocument = {
                                username: user.name,
                                emailAddress: user.email,
                            };

                            await credsCollection.insertOne(userDocument);
                        }

                        // Setup a blank profile if the user is signing in for the first time.
                        if (!profile) {
                            const profileDocument = {
                                emailAddress: user.email,
                                instagram: '',
                                twitter: '',
                                twitch: '',
                                youtube: '',
                                ebay: '',
                            };

                            await profileCollection.insertOne(profileDocument);
                        }

                        // Set up achievements document if the user hasn't logged in before.
                        if (!achievements && token) {
                            // Send a post requet to setup a draft gift card.
                            const draftGiftCard = await cl.post('/api/gift_cards', {
                                data: {
                                    type: 'gift_cards',
                                    attributes: {
                                        currency_code: 'GBP',
                                        balance_cents: 0,
                                        single_use: false,
                                        rechargeable: true,
                                        recipient_email: user.email,
                                        reference: `${user.email}-reward-card`,
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
                                            emailAddress: user.email,
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
                            const customerCount = safelyParse(customerData, 'data.meta.record_count', parseAsNumber, 0);

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
                                    { $set: { commerceId: safelyParse(customer, 'data.data.id', parseAsString, null) } }
                                );
                            } else {
                                const customer = safelyParse(
                                    customerData,
                                    'data.data',
                                    parseAsCommerceResponseArray,
                                    null
                                );

                                if (customer) {
                                    await credsCollection.updateOne(
                                        { emailAddress: user.email },
                                        { $set: { commerceId: safelyParse(customer[0], 'id', parseAsString, null) } }
                                    );
                                }
                            }
                        }
                    } catch (err) {
                        console.log('🚀 ~ file: [...nextauth].ts ~ line 266 ~ signIn ~ err', err);
                        throw err;
                    }

                    return true;
                }

                return true;
            },
        },
        /* adapter: MongoDBAdapter({
            db: (await connectToDatabase()).db,
        }), */
        adapter: MongoDBAdapter(clientPromise),
        debug: false,
    });
}
