import NextAuth, { NextAuthOptions, User } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import { NextApiRequest, NextApiResponse } from 'next';
import { MongoDBAdapter } from '@next-auth/mongodb-adapter';
import bcrypt from 'bcrypt';
import { DateTime } from 'luxon';

import clientPromise from '../../../lib/mongodb';
import { connectToDatabase } from '../../../middleware/database';
import { parseAsString, safelyParse } from '../../../utils/parsers';
import { Roles } from '../../../enums/auth';

const isDev = process.env.NODE_ENV === 'development';
const databaseName = isDev ? 'kingofcardboard' : 'kingofcardboard_live';
const publicURL = process.env.NEXT_PUBLIC_SITE_URL || '';
const secret = process.env.JWT_SECRET || '';
const salt = process.env.SALT || 10;
const currentDate = DateTime.now().setZone('Europe/London').toISO();
const defaultUserDetails = {
    image: null,
    emailVerified: false,
    registrationDate: currentDate,
    lastLoggedIn: currentDate,
    role: Roles.User,
    instagram: null,
    twitter: null,
    twitch: null,
    youtube: null,
    ebay: null,
    coins: 0,
};

async function setUpUserExtras(userId: string): Promise<void> {
    const { db } = await connectToDatabase();
    const achievementsCollection = db.collection('achievements');

    // Set up achievements document if the user hasn't logged in before.
    const achievements = await achievementsCollection.findOne({ userId });
    if (!achievements) {
        await achievementsCollection.insertOne({
            userId,
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
            emailVerified: user.emailVerified,
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
                const userCollection = db.collection('users');

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
                    const existingUser = await userCollection.findOne({ email });

                    // If the user email doesn't exist then add them to the database.
                    if (existingUser) {
                        // Check passwords match
                        const doesPasswordMatch = await bcrypt.compare(password, existingUser.password);

                        if (!doesPasswordMatch) throw new Error('Password incorrect.');

                        return {
                            id: existingUser._id.toString(),
                            email,
                            role: existingUser.role,
                        };
                    } else {
                        // Encrypt the user's password.
                        const hashedPassword = await bcrypt.hash(password, salt);

                        const userDocument = {
                            name,
                            email,
                            password: hashedPassword,
                            ...defaultUserDetails,
                        };

                        const newUser = await userCollection.insertOne(userDocument);
                        const userId = newUser.insertedId.toString();

                        // Build other user related items in the DB on register.
                        await setUpUserExtras(userId);

                        //gaEvent('registration', { email });

                        return {
                            id: userId,
                            email,
                            password,
                            ...defaultUserDetails,
                        };
                    }
                } catch (error) {
                    //gaEvent('failedRegistration', { email });
                    throw new Error(error as string);
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
                const { db } = await connectToDatabase();
                const userCollection = db.collection('users');
                const existingUser = await userCollection.findOne({ email });

                // Build other user related items in the DB on register.
                if (existingUser) {
                    await setUpUserExtras(existingUser._id.toString());
                }

                return {
                    id: profile.sub,
                    name: profile.name,
                    email,
                    password: null,
                    image: profile.picture,
                    emailVerified: profile.email_verified,
                    registrationDate,
                    lastLoggedIn,
                    role,
                    instagram,
                    twitter,
                    twitch,
                    youtube,
                    ebay,
                    coins,
                };
            },
            // Link all OAuth accounts by email.
            allowDangerousEmailAccountLinking: true,
        }),
    ],
    secret,
    session: {
        // Must be set to JWT for credentials to work.
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
        async signIn({ user }) {
            const email = safelyParse(user, 'email', parseAsString, '');

            // Set the user lastLoggedIn value
            await setUserLoginDate(email);

            // Log the sign in as a gaEvent
            //gaEvent('login', { email });

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
