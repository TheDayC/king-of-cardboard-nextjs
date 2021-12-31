import axios from 'axios';

import { errorHandler } from '../middleware/errors';
import { CartItem, CustomerDetails } from '../store/types/state';
import { ErrorResponse } from '../types/api';
import { Order } from '../types/cart';
import { authClient } from './auth';
import { parseAsBoolean, parseAsNumber, safelyParse } from './parsers';

export async function confirmOrder(
    accessToken: string,
    orderId: string,
    attribute: string
): Promise<boolean | ErrorResponse[]> {
    try {
        const cl = authClient(accessToken);
        const res = await cl.patch(`/api/orders/${orderId}`, {
            data: {
                type: 'orders',
                id: orderId,
                attributes: {
                    [attribute]: true,
                },
            },
        });

        const status = safelyParse(res, 'status', parseAsNumber, 500);

        return status === 200;
    } catch (error: unknown) {
        return errorHandler(error, 'We could not confirm your order.');
    }
}

export async function refreshPayment(
    accessToken: string,
    id: string,
    paymentSourceType: string
): Promise<boolean | ErrorResponse[]> {
    try {
        const cl = authClient(accessToken);
        const res = await cl.patch(`/api/${paymentSourceType}/${id}`, {
            data: {
                type: paymentSourceType,
                id,
                attributes: {
                    _refresh: true,
                },
            },
        });
        const status = safelyParse(res, 'status', parseAsNumber, 500);

        return status === 200;
    } catch (error: unknown) {
        return errorHandler(error, 'We could not refresh the payment source.');
    }
}

export async function sendOrderConfirmation(
    order: Order,
    items: CartItem[],
    customerDetails: CustomerDetails
): Promise<boolean | ErrorResponse[]> {
    try {
        const response = await axios.post('/api/sendOrderConfirmation', {
            order,
            items,
            customerDetails,
        });

        return safelyParse(response, 'data.hasSent', parseAsBoolean, false);
    } catch (error: unknown) {
        return errorHandler(error, 'We could not send your order confirmation.');
    }
}
