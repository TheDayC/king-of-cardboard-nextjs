import axios from 'axios';
import { errorHandler } from '../middleware/errors';
import { AddOrderResponse } from '../types/checkout';

import { parseAsNumber, parseAsString, safelyParse } from './parsers';

const URL = process.env.NEXT_PUBLIC_SITE_URL || '';

export async function addOrder(options: any): Promise<AddOrderResponse> {
    try {
        const res = await axios.post(`${URL}/api/orders/add`, {
            ...options,
        });

        return {
            _id: safelyParse(res, 'data._id', parseAsString, null),
            orderNumber: safelyParse(res, 'data.orderNumber', parseAsNumber, null),
            subTotal: safelyParse(res, 'data.subTotal', parseAsNumber, 0),
            discount: safelyParse(res, 'data.discount', parseAsNumber, 0),
            shipping: safelyParse(res, 'data.shipping', parseAsNumber, 0),
            total: safelyParse(res, 'data.total', parseAsNumber, 0),
        };
    } catch (error: unknown) {
        errorHandler(error, 'Could not add order.');
    }

    return {
        _id: null,
        orderNumber: null,
        subTotal: 0,
        discount: 0,
        shipping: 0,
        total: 0,
    };
}

export function calculateExcessCoinSpend(coins: number, subTotal: number): number {
    const calc = subTotal - coins;

    if (calc < 0) return Math.abs(calc);

    return 0;
}
