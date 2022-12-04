import NextAuth, { NextAuthOptions, User } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import { NextApiRequest, NextApiResponse } from 'next';
import { MongoDBAdapter } from '@next-auth/mongodb-adapter';
import bcrypt from 'bcrypt';

import clientPromise from '../../../lib/mongodb';
import { connectToDatabase } from '../../../middleware/database';
import { parseAsString, safelyParse } from '../../../utils/parsers';
import { gaEvent } from '../../../utils/ga';
import { Roles } from '../../../enums/auth';
import { DateTime } from 'luxon';

const isDev = process.env.NODE_ENV === 'development';
const databaseName = isDev ? 'kingofcardboard' : 'kingofcardboard_live';
const publicURL = process.env.NEXT_PUBLIC_SITE_URL || '';
const secret = process.env.JWT_SECRET || '';
const salt = process.env.SALT || 10;
const currentDate = DateTime.now().setZone('Europe/London').toISO();
const defaultUserDetails = {
    emailVerified: false,
    image: null,
    role: Roles.User,
    instagram: null,
    twitter: null,
    twitch: null,
    youtube: null,
    ebay: null,
    coins: 0,
    registrationDate: currentDate,
    lastLoggedIn: currentDate,
};

async function setUpUserExtras(email: string): Promise<void> {
    const { db } = await connectToDatabase();
    const achievementsCollection = db.collection('achievements');

    // Set up achievements document if the user hasn't logged in before.
    const achievements = await achievementsCollection.findOne({ email });
    if (!achievements) {
        await achievementsCollection.insertOne({
            email,
            achievements: [],
        });
    }
}

async function getUserDetails(email: string): Promise<User | null> {
    const { db } = await connectToDatabase();
    const usersCollection = db.collection('users');
    const user = await usersCollection.findOne({ email });

    if (user) {
        return {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            image: user.image,
            emailVerified: user.email_verified,
            role: user.role,
            instagram: user.instagram,
            twitter: user.twitter,
            twitch: user.twitch,
            youtube: user.youtube,
            ebay: user.ebay,
            coins: user.coins,
            registrationDate: user.registrationDate,
            lastLoggedIn: user.lastLoggedIn,
        };
    }

    return null;
}

async function setUserLoginDate(email: string): Promise<void> {
    const { db } = await connectToDatabase();
    const usersCollection = db.collection('users');

    await usersCollection.updateOne(
        { email },
        {
            $set: {
                lastLoggedIn: DateTime.now().setZone('Europe/London').toISO(),
            },
        }
    );
}

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: 'users',
            credentials: {
                emailAddress: { label: 'Email Address', type: 'text', placeholder: 'Email' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials) {
                // Connect to MongoDB.
                const { db } = await connectToDatabase();
                const collection = db.collection('users');

                // Parse credentials.
                const name = safelyParse(credentials, 'displayName', parseAsString, '');
                const email = safelyParse(credentials, 'emailAddress', parseAsString, null);
                const password = safelyParse(credentials, 'password', parseAsString, null);

                // If credentials don't exist then throw an error.
                if (!email || !password) {
                    throw new Error('Must provide an email and password');
                }

                try {
                    // Try and find the user.
                    const user = await collection.findOne({ email });

                    // If the user email doesn't exist then add them to the database.
                    if (!user) {
                        // Encrypt the user's password.
                        const hashedPassword = await bcrypt.hash(password, salt);

                        const userDocument = {
                            ...defaultUserDetails,
                            name,
                            email,
                            password: hashedPassword,
                        };

                        const user = await collection.insertOne(userDocument);

                        if (user) {
                            // Build other user related items in the DB on register.
                            await setUpUserExtras(email);

                            gaEvent('registration', { email });

                            return {
                                id: user.insertedId.toString(),
                                email,
                                ...defaultUserDetails,
                            };
                        } else {
                            gaEvent('failedRegistration', { email });
                        }
                    }

                    return null;
                } catch (error) {
                    gaEvent('failedRegistration', { email });
                    throw new Error('Unable to register user.');
                }
            },
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_ID || '',
            clientSecret: process.env.GOOGLE_SECRET || '',
            async profile(profile) {
                const { role, instagram, twitter, twitch, youtube, ebay, coins, registrationDate, lastLoggedIn } =
                    defaultUserDetails;
                const email = safelyParse(profile, 'email', parseAsString, '');

                // Build other user related items in the DB on register.
                await setUpUserExtras(email);

                return {
                    id: profile.sub,
                    name: profile.name,
                    email,
                    password: null,
                    image: profile.picture,
                    emailVerified: profile.email_verified,
                    role,
                    instagram,
                    twitter,
                    twitch,
                    youtube,
                    ebay,
                    coins,
                    registrationDate,
                    lastLoggedIn,
                };
            },
            // Link all OAuth accounts by email.
            allowDangerousEmailAccountLinking: true,
        }),
    ],
    secret,
    session: {
        // Seconds - How long until an idle session expires and is no longer valid.
        maxAge: 30 * 24 * 60 * 60, // 30 days

        // Seconds - Throttle how frequently to write to database to extend a session.
        // Use it to limit write operations. Set to 0 to always update the database.
        // Note: This option is ignored if using JSON Web Tokens
        updateAge: 24 * 60 * 60, // 24 hours
    },
    jwt: {
        // A secret to use for key generation. Defaults to the top-level `secret`.
        secret,
        // The maximum age of the NextAuth.js issued JWT in seconds.
        // Defaults to `session.maxAge`.
        maxAge: 60 * 60 * 24 * 30,
    },
    pages: {
        signIn: `${publicURL}/account`,
        signOut: `${publicURL}/login?signedOut=true`,
        error: `${publicURL}/login`, // Error code passed in query string as ?error=
        newUser: `${publicURL}/account`,
    },
    callbacks: {
        async signIn({ user, credentials }) {
            const { db } = await connectToDatabase();
            const credsCollection = db.collection('user');
            const email = safelyParse(user, 'email', parseAsString, '');
            const password = safelyParse(user, 'password', parseAsString, null);

            // If the user provides credentials then we have a manual login to perform.
            if (credentials) {
                try {
                    // Ensure the user submits valid email and password.
                    if (!email || !password) throw new Error('Email or password missing.');

                    // Reject user if their credentials don't exist.
                    const creds = await credsCollection.findOne({ email });
                    if (!creds) throw new Error('User does not exist, please register first.');

                    // Check passwords match
                    const doesPasswordMatch = await bcrypt.compare(password, creds.password);
                    if (!doesPasswordMatch) throw new Error('Password incorrect.');
                } catch (error) {
                    throw new Error('Unable to sign in user.');
                }
            }

            // Set the user lastLoggedIn value
            await setUserLoginDate(email);

            // Log the sign in as a gaEvent
            gaEvent('login', { email });

            // Allow the user in.
            return true;
        },
        async session({ session }) {
            const email = session.user.email;

            if (email) {
                const details = await getUserDetails(email);

                if (details) {
                    session.user = details;
                }
            }

            return session;
        },
        async jwt({ token }) {
            return token;
        },
    },
    adapter: MongoDBAdapter(clientPromise, { databaseName }),
    debug: false,
};

export default async function auth(req: NextApiRequest, res: NextApiResponse): Promise<void> {
    return await NextAuth(req, res, authOptions);
}
