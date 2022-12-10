import NextAuth, { DefaultSession, DefaultUser, Profile as DefaultProfile } from 'next-auth';

import { Roles } from '../enums/auth';

declare module 'next-auth' {
    interface User extends DefaultUser {
        role: Roles; // Add roles to the user object.
        instagram?: string | null;
        twitter?: string | null;
        twitch?: string | null;
        youtube?: string | null;
        ebay?: string | null;
        coins?: number;
        emailVerified?: boolean;
        registrationDate?: string;
        lastLoggedIn?: string;
    }

    interface Profile extends DefaultProfile {
        password: string | null;
        role: Roles;
        instagram: string | null;
        twitter: string | null;
        twitch: string | null;
        youtube: string | null;
        ebay: string | null;
        coins: number;
    }

    // Update session interface for next auth.
    interface Session {
        user: User & DefaultSession['user'];
    }
}
