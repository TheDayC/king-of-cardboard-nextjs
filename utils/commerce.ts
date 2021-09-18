import { getSalesChannelToken } from '@commercelayer/js-auth';
import { DateTime } from 'luxon';

import { CommerceAuth } from '../types/commerce';

export async function getCommerceAuth(): Promise<CommerceAuth | null> {
    const token = await getSalesChannelToken({
        clientId: process.env.NEXT_PUBLIC_ECOM_CLIENT_ID || '',
        endpoint: process.env.NEXT_PUBLIC_ECOM_DOMAIN || '',
        scope: 'market:6098',
    });

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
