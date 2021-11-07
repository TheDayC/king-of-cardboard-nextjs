import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import TwitchProvider from 'next-auth/providers/twitch';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcrypt';
import { MongoDBAdapter } from '@next-auth/mongodb-adapter';

import { connectToDatabase } from '../../../middleware/database';

export default async function auth(req: any, res: any): Promise<any> {
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
                async authorize(credentials, req) {
                    // You need to provide your own logic here that takes the credentials
                    // submitted and returns either a object representing a user or value
                    // that is false/null if the credentials are invalid.
                    // e.g. return { id: 1, name: 'J Smith', email: 'jsmith@example.com' }
                    // You can also use the `req` object to obtain additional parameters
                    // (i.e., the request IP address)

                    const { emailAddress, password } = JSON.parse(JSON.stringify(credentials));
                    const { db } = await connectToDatabase();
                    const collection = db.collection('users');

                    if (emailAddress && password) {
                        const user = await collection.findOne({ emailAddress });

                        if (user) {
                            const match = await bcrypt.compare(password, user.password);

                            if (match) {
                                return { id: user._id, username: user.username, email: user.emailAddress };
                            }
                        }
                    }

                    // Return null if user data could not be retrieved
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
        jwt: {
            secret: process.env.JWT_ENCRYPT,
        },
        pages: {
            signIn: '/login',
            signOut: '/login?signedOut=true',
            error: '/login', // Error code passed in query string as ?error=
            newUser: '/new-user',
        },
        callbacks: {
            /* async signIn({ user, account, profile, email, credentials }) {
            console.log("🚀 ~ file: [...nextauth].ts ~ line 66 ~ signIn ~ credentials", credentials)
            return true
        },
        async redirect({ url, baseUrl }) {
            return baseUrl
        },
        async session({ session, user, token }) {
            return session
        },
        async jwt({ token, user, account, profile, isNewUser }) {
            return token
        }, */
        },
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        adapter: MongoDBAdapter({
            db: (await connectToDatabase()).db,
        }),
    });
}
