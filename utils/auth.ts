import axios, { AxiosInstance } from 'axios';
import { DateTime } from 'luxon';

import { errorHandler } from '../middleware/errors';
import { UserSession } from '../types/auth';
import { CreateToken } from '../types/commerce';
import { parseAsNumber, parseAsString, safelyParse } from './parsers';

// Create a authClient with axios
export function authClient(accessToken: string | null = null): AxiosInstance {
    const defaultHeaders = {
        Accept: 'application/vnd.api+json',
        'Content-Type': 'application/vnd.api+json',
    };

    const headers = accessToken
        ? {
              ...defaultHeaders,
              Authorization: `Bearer ${accessToken}`,
          }
        : defaultHeaders;

    return axios.create({
        baseURL: process.env.NEXT_PUBLIC_ECOM_DOMAIN,
        headers,
    });
}

export function userClient(): AxiosInstance {
    const headers = {
        Accept: 'application/json',
        'Content-Type': 'application/json',
    };

    return axios.create({
        baseURL: process.env.NEXT_PUBLIC_ECOM_DOMAIN,
        headers,
    });
}

// Create commerce layer access token
export async function createToken(): Promise<CreateToken> {
    try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_SITE_URL || ''}/api/getAccessToken`);
        const now = DateTime.now().setZone('Europe/London');
        const token = safelyParse(res, 'data.token', parseAsString, null);
        const expires = safelyParse(res, 'data.expires', parseAsNumber, now.toSeconds());
        const expiresIso = DateTime.now().setZone('Europe/London').plus({ seconds: expires }).toISO();

        return {
            token,
            expires: expiresIso,
        };
    } catch (error: unknown) {
        errorHandler(error, 'We could not create an auth token, please refresh.');
    }

    return {
        token: null,
        expires: DateTime.now().setZone('Europe/London').toISO(),
    };
}

export async function registerUser(
    accessToken: string,
    username: string,
    emailAddress: string,
    password: string
): Promise<boolean> {
    try {
        const response = await axios.post(`${process.env.NEXT_PUBLIC_SITE_URL || ''}/api/register`, {
            username,
            emailAddress,
            password,
            token: accessToken,
        });

        const status = safelyParse(response, 'status', parseAsNumber, false);

        return status === 200;
    } catch (error: unknown) {
        errorHandler(error, 'Failed to register user at this time.');
    }

    return false;
}

export async function createUserToken(emailAddress: string, password: string): Promise<UserSession> {
    try {
        const tokenRes = await userClient().post('/oauth/token', {
            grant_type: 'password',
            username: emailAddress,
            password,
            client_id: process.env.NEXT_PUBLIC_ECOM_SALES_ID,
            scope: process.env.NEXT_PUBLIC_MARKET,
        });
        const createdAt = safelyParse(
            tokenRes,
            'data.created_at',
            parseAsNumber,
            DateTime.now().setZone('Europe/London').toSeconds()
        );
        const expiresIn = safelyParse(tokenRes, 'data.expires_in', parseAsNumber, 0);

        return {
            token: safelyParse(tokenRes, 'data.access_token', parseAsString, null),
            id: safelyParse(tokenRes, 'data.owner_id', parseAsString, null),
            expiry: DateTime.fromSeconds(createdAt + expiresIn, { zone: 'Europe/London' }).toISO(),
        };
    } catch (error: unknown) {
        errorHandler(error, 'Failed to register user at this time.');
    }

    return {
        token: null,
        id: null,
        expiry: null,
    };
}
