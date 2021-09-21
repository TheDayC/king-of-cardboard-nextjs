import { getSalesChannelToken } from '@commercelayer/js-auth';
import CommerceLayer, { CommerceLayerClient } from '@commercelayer/sdk';
import { DateTime } from 'luxon';

import { CommerceAuthProps } from '../types/commerce';

export async function getCommerceAuth(): Promise<CommerceAuthProps | null> {
    const token = await getSalesChannelToken({
        clientId: process.env.NEXT_PUBLIC_ECOM_CLIENT_ID || '',
        endpoint: process.env.NEXT_PUBLIC_ECOM_DOMAIN || '',
        scope: 'market:6098',
    });

    if (token) {
        const parsedDate = token.expires ? DateTime.fromJSDate(token.expires) : null;
        const isoDate = parsedDate ? parsedDate.toISO() : '';

        return {
            accessToken: token.accessToken,
            expires: isoDate,
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

export const orderQueryParams = {
    include: ['line_items'],
    fields: {
        orders: [
            'number',
            'skus_count',
            'formatted_subtotal_amount',
            'formatted_discount_amount',
            'formatted_shipping_amount',
            'formatted_total_tax_amount',
            'formatted_gift_card_amount',
            'formatted_total_amount_with_taxes',
            'line_items',
        ],
        line_items: [
            'item_type',
            'image_url',
            'name',
            'sku_code',
            'formatted_unit_amount',
            'quantity',
            'formatted_total_amount',
        ],
    },
};
