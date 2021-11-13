import axios from 'axios';

import { GetOrders } from '../types/account';
import { parseAsCommerceResponseArray, safelyParse, parseAsCommerceMeta } from './parsers';

export async function getOrders(
    accessToken: string,
    emailAddress: string,
    pageSize: number,
    page: number
): Promise<GetOrders | null> {
    try {
        const response = await axios.post('/api/account/getOrders', {
            token: accessToken,
            emailAddress,
            pageSize,
            page,
        });

        if (response) {
            const orders = safelyParse(response, 'data.orders', parseAsCommerceResponseArray, null);
            const included = safelyParse(response, 'data.included', parseAsCommerceResponseArray, null);
            const meta = safelyParse(response, 'data.meta', parseAsCommerceMeta, null);

            return { orders, included, meta };
        }

        return null;
    } catch (error) {
        console.log('Error: ', error);
    }

    return null;
}

export function statusColour(status: string): string {
    switch (status) {
        case 'approved':
            return 'green';
        case 'placed':
        case 'pending':
            return 'yellow';
        case 'cancelled':
            return 'red';
        default:
            return 'gray';
    }
}

export function paymentStatusColour(status: string): string {
    switch (status) {
        case 'paid':
            return 'green';
        case 'authorized':
            return 'yellow';
        case 'voided':
        case 'refunded':
            return 'red';
        default:
            return 'gray';
    }
}

export function fulfillmentStatusColour(status: string): string {
    switch (status) {
        case 'fulfilled':
            return 'green';
        case 'in_progress':
            return 'yellow';
        default:
            return 'gray';
    }
}
