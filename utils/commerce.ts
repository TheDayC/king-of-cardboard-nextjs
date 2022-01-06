import { errorHandler } from '../middleware/errors';
import { PaymentSourceResponse } from '../types/api';
import { CreateOrder } from '../types/cart';
import { PaymentAttributes } from '../types/checkout';
import { LineItemAttributes, LineItemRelationships } from '../types/commerce';
import { authClient } from './auth';
import { parseAsString, safelyParse, parseAsNumber } from './parsers';

export async function createOrder(accessToken: string, isGuest: boolean): Promise<CreateOrder> {
    try {
        const cl = authClient(accessToken);
        const res = await cl.post('/api/orders?fields[orders]=id,number', {
            data: {
                type: 'orders',
                attributes: {
                    guest: isGuest,
                },
            },
        });

        return {
            orderId: safelyParse(res, 'data.data.id', parseAsString, null),
            orderNumber: safelyParse(res, 'data.data.attributes.number', parseAsNumber, null),
        };
    } catch (error: unknown) {
        errorHandler(error, 'Failed to create an order.');
    }

    return {
        orderId: null,
        orderNumber: null,
    };
}

export async function setLineItem(
    accessToken: string,
    attributes: LineItemAttributes,
    relationships: LineItemRelationships
): Promise<boolean> {
    try {
        const cl = authClient(accessToken);
        const res = await cl.post('/api/line_items', {
            data: {
                type: 'line_items',
                attributes,
                relationships,
            },
        });
        const status = safelyParse(res, 'status', parseAsNumber, 500);

        return status === 201;
    } catch (error: unknown) {
        errorHandler(error, 'We could not fetch an order.');
    }

    return false;
}

export async function removeLineItem(accessToken: string, id: string): Promise<boolean> {
    try {
        const cl = authClient(accessToken);
        const res = await cl.delete(`/api/line_items/${id}`);
        const status = safelyParse(res, 'status', parseAsNumber, 500);

        return status === 204;
    } catch (error: unknown) {
        errorHandler(error, 'We could not remove this item.');
    }

    return false;
}

export async function updateLineItem(accessToken: string, id: string, quantity: number): Promise<boolean> {
    try {
        const cl = authClient(accessToken);
        const res = await cl.patch(`/api/line_items/${id}`, {
            data: {
                type: 'line_items',
                id,
                attributes: {
                    quantity,
                },
            },
        });
        const status = safelyParse(res, 'status', parseAsNumber, 500);

        return status === 200;
    } catch (error: unknown) {
        errorHandler(error, 'We could not fetch an order.');
    }

    return false;
}

export async function createPaymentSource(
    accessToken: string,
    id: string,
    paymentSourceType: string,
    attributes: PaymentAttributes
): Promise<PaymentSourceResponse> {
    try {
        const cl = authClient(accessToken);
        const res = await cl.post(`/api/${paymentSourceType}`, {
            data: {
                type: paymentSourceType,
                attributes: { ...attributes },
                relationships: {
                    order: {
                        data: {
                            type: 'orders',
                            id,
                        },
                    },
                },
            },
        });

        return {
            paymentId: safelyParse(res, 'data.data.id', parseAsString, null),
            clientSecret: safelyParse(res, 'data.data.attributes.client_secret', parseAsString, null),
            approvalUrl: safelyParse(res, 'data.data.attributes.approval_url', parseAsString, null),
        };
    } catch (error: unknown) {
        errorHandler(error, 'We could not create a payment source.');
    }

    return {
        paymentId: null,
        clientSecret: null,
        approvalUrl: null,
    };
}
