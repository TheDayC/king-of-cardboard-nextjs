import axios from 'axios';

import { errorHandler } from '../middleware/errors';
import { CartItem, CustomerAddress, CustomerDetails } from '../store/types/state';
import { authClient } from './auth';
import { parseAsNumber, safelyParse } from './parsers';

export async function confirmOrder(accessToken: string, orderId: string, attribute: string): Promise<boolean> {
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
        errorHandler(error, 'We could not confirm your order.');
    }

    return false;
}

export async function refreshPayment(accessToken: string, id: string, paymentSourceType: string): Promise<boolean> {
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
        errorHandler(error, 'We could not refresh the payment source.');
    }

    return false;
}

export async function sendOrderConfirmation(
    orderNumber: number | null,
    subTotal: string | null,
    shipping: string | null,
    total: string | null,
    items: CartItem[],
    customerDetails: CustomerDetails,
    billingAddress: CustomerAddress,
    shippingAddress: CustomerAddress
): Promise<boolean> {
    try {
        const res = await axios.post('/api/sendOrderConfirmation', {
            orderNumber,
            subTotal,
            shipping,
            total,
            items,
            customerDetails,
            billingAddress,
            shippingAddress,
        });
        const status = safelyParse(res, 'status', parseAsNumber, 500);

        return status === 200;
    } catch (error: unknown) {
        errorHandler(error, 'We could not send your order confirmation.');
    }

    return false;
}
