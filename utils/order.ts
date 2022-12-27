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
        };
    } catch (error: unknown) {
        errorHandler(error, 'Could not add order.');
    }

    return {
        _id: null,
        orderNumber: null,
    };
}
