import axios, { AxiosInstance } from 'axios';
import { get } from 'lodash';
import { DateTime } from 'luxon';
import jwt from 'jsonwebtoken';
import Cookie from 'js-cookie';

import { CreateToken } from '../types/commerce';

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

// Create commerce layer access token
export async function createToken(): Promise<CreateToken | null> {
    try {
        const accessDetails = await axios.get('/api/getAccessToken');

        if (accessDetails) {
            const token: string | null = get(accessDetails, 'data.token', null);
            const expires: number | null = get(accessDetails, 'data.expires', null);
            const expiresIso = expires
                ? DateTime.now().setZone('Europe/London').plus({ minutes: expires }).toISO()
                : null;

            return {
                token,
                expires: expiresIso,
            };
        }
    } catch (error) {
        console.log('Error: ', error);
    }

    return {
        token: null,
        expires: null,
    };
}

export function signUserToken(id: string, email: string): string {
    const payload = {
        userId: id,
        email: email,
    };

    const options = {
        expiresIn: 3000,
    };

    return jwt.sign(payload, process.env.USER_TOKEN_SECRET || '', options);
}

export function fetchUserToken(): string | undefined {
    return Cookie.get('token');
}
