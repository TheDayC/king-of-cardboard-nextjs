import axios from 'axios';
import { errorHandler } from '../middleware/errors';
import { Order } from '../types/orders';
import { AddOrderResponse } from '../types/checkout';
import { ResponseError } from '../types/errors';
import { ListOrders } from '../types/orders';

import { parseAsNumber, parseAsString, safelyParse } from './parsers';

const URL = process.env.NEXT_PUBLIC_SITE_URL || '';

export async function addOrder(options: any): Promise<AddOrderResponse> {
    try {
        const res = await axios.post(`${URL}/api/account/orders/add`, {
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

export async function getOrder(userId: string, orderNumber: number): Promise<Order | ResponseError> {
    try {
        const res = await axios.get(`${URL}/api/account/orders/get`, {
            params: {
                userId,
                orderNumber,
            },
            headers: {
                'Accept-Encoding': 'application/json',
            },
        });

        return res.data as Order;
    } catch (error: unknown) {
        return errorHandler(error, 'Could not get order.');
    }
}

export async function listOrders(
    userId: string,
    count: number,
    page: number,
    isServer: boolean = false
): Promise<ListOrders | ResponseError> {
    try {
        const headers = isServer ? { 'Accept-Encoding': 'application/json' } : undefined;
        const res = await axios.post(
            `${URL}/api/account/orders/list`,
            {
                userId,
                count,
                page,
            },
            {
                headers,
            }
        );

        return {
            orders: res.data.orders as Order[],
            count: safelyParse(res, 'data.count', parseAsNumber, 0),
        };
    } catch (error: unknown) {
        return errorHandler(error, 'Could not list orders.');
    }
}

export function calculateExcessCoinSpend(coins: number, subTotal: number): number {
    const calc = subTotal - coins;

    if (calc < 0) return Math.abs(calc);

    return 0;
}
