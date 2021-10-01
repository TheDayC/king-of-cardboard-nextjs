import { getSalesChannelToken } from '@commercelayer/js-auth';
import CommerceLayer, { CommerceLayerClient } from '@commercelayer/sdk';
import { Price } from '@commercelayer/sdk/lib/resources/prices';
import axios from 'axios';
import { get } from 'lodash';
import { DateTime } from 'luxon';

import { CommerceAuthProps, StockItem } from '../types/commerce';

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

export async function createOrder(accessToken: string): Promise<string | null> {
    try {
        const { data } = await axios.post('/api/createOrder', {
            token: accessToken,
        });

        if (data) {
            const { order } = data;
            console.log('🚀 ~ file: commerce.ts ~ line 46 ~ createOrder ~ order', order);

            return order.id;
        }
    } catch (error) {
        console.log('Error: ', error);
    }

    return null;
}

export async function getStockItems(accessToken: string): Promise<StockItem[] | null> {
    try {
        const response = await axios.post('/api/stockItems', {
            token: accessToken,
        });

        if (response) {
            const stockItems = get(response, 'data.stockItems', null);

            return stockItems.map((item) => {
                const id = get(item, 'id', '');
                const sku_code = get(item, 'attributes.sku_code', '');
                const reference = get(item, 'attributes.reference', '');
                const quantity = get(item, 'attributes.quantity', 0);
                const created_at = get(item, 'attributes.created_at', '');

                return {
                    id,
                    attributes: {
                        sku_code,
                        reference,
                        quantity,
                        created_at,
                    },
                };
            });
        }
    } catch (error) {
        console.log('Error: ', error);
    }

    return null;
}

export async function getPrices(accessToken: string): Promise<Price[] | null> {
    try {
        const response = await axios.post('/api/prices', {
            token: accessToken,
        });

        if (response) {
            const prices = get(response, 'data.prices', null);
            console.log('🚀 ~ file: commerce.ts ~ line 103 ~ getPrices ~ prices', prices);

            return prices.map((price) => {
                const id = get(price, 'id', '');
                const sku_code = get(price, 'attributes.sku_code', '');
                const created_at = get(price, 'attributes.created_at', '');
                const formatted_amount = get(price, 'attributes.formatted_amount', '');
                const currency_code = get(price, 'attributes.currency_code', '');
                const amount_float = get(price, 'attributes.amount_float', 0);
                const amount_cents = get(price, 'attributes.amount_cents', 0);

                return {
                    id,
                    attributes: {
                        sku_code,
                        created_at,
                        formatted_amount,
                        currency_code,
                        amount_float,
                        amount_cents,
                    },
                };
            });

            return null;
        }
    } catch (error) {
        console.log('Error: ', error);
    }

    return null;
}
