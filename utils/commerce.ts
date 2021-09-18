import { authorizeWebapp, getSalesChannelToken, getWebappToken } from '@commercelayer/js-auth';
import CommerceLayer, { CommerceLayerClient } from '@commercelayer/sdk';
import { DateTime } from 'luxon';

import { CommerceAuth } from '../types/commerce';

export async function getCommerceAuth(): Promise<CommerceAuth | null> {
    const token = await getSalesChannelToken({
        clientId: process.env.NEXT_PUBLIC_ECOM_CLIENT_ID || '',
        endpoint: process.env.NEXT_PUBLIC_ECOM_DOMAIN || '',
        scope: 'market:6098',
    });

    /* const baseCommerceLayerConfig = {
        clientId: process.env.NEXT_PUBLIC_ECOM_CLIENT_ID || '',
        clientSecret: process.env.NEXT_PUBLIC_ECOM_CLIENT_SECRET || '',
        callbackUrl: 'http://localhost:3000/',
        endpoint: process.env.NEXT_PUBLIC_ECOM_DOMAIN || '',
        scope: 'market:6098',
    };

    authorizeWebapp(baseCommerceLayerConfig);

    const token = await getWebappToken({
        ...baseCommerceLayerConfig,
        callbackUrlWithCode: 'http://localhost:3000/?code=your-auth-code', // triggers the access token request
    }); */

    if (token) {
        const parsedDate = token.expires ? DateTime.fromJSDate(token.expires) : null;
        const isoDate = parsedDate ? parsedDate.toISO() : '';

        return {
            props: {
                accessToken: token.accessToken,
                expires: isoDate,
            },
        };
    }

    return null;
}

export function initCommerceClient(accessToken: string): CommerceLayerClient {
    const cl = CommerceLayer({
        accessToken: accessToken,
        organization: process.env.NEXT_PUBLIC_ORG_SLUG || '',
    });

    return cl;
}
