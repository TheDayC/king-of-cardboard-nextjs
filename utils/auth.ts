import axios, { AxiosInstance } from 'axios';
import { get } from 'lodash';
import { DateTime } from 'luxon';

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

// Create commerce layer access token
export async function createToken(): Promise<CreateToken | null> {
    try {
        const accessDetails = await axios.get('/api/getAccessToken');

        if (accessDetails) {
            const token = safelyParse(accessDetails, 'data.token', parseAsString, null);
            const expires = safelyParse(accessDetails, 'data.expires', parseAsNumber, null);
            const expiresIso = expires
                ? DateTime.now().setZone('Europe/London').plus({ seconds: expires }).toISO()
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
