import CommerceLayer, { LineItem } from '@commercelayer/sdk';
import { get, join } from 'lodash';

import { errorHandler } from '../middleware/errors';
import { PaymentSourceResponse } from '../types/api';
import { CreateOrder, FetchOrder } from '../types/cart';
import { PaymentAttributes } from '../types/checkout';
import { LineItemAttributes, LineItemRelationships } from '../types/commerce';
import { SavedSkuOptions } from '../types/products';
import { authClient } from './auth';
import { parseAsString, safelyParse, parseAsNumber } from './parsers';

const organization = process.env.NEXT_PUBLIC_ECOM_SLUG || '';

export async function createOrder(accessToken: string, isGuest: boolean): Promise<CreateOrder> {
    try {
        const cl = CommerceLayer({ organization, accessToken });
        const order = await cl.orders.create({ guest: isGuest });

        return {
            orderId: order.id,
            orderNumber: order.number || null,
            expiry: order.expires_at || null,
        };
    } catch (error: unknown) {
        errorHandler(error, 'Failed to create an order.');
    }

    return {
        orderId: null,
        orderNumber: null,
        expiry: null,
    };
}

export async function getOrder(accessToken: string, orderId: string): Promise<FetchOrder | null> {
    try {
        const cl = CommerceLayer({ organization, accessToken });
        const order = await cl.orders.retrieve(orderId, {
            fields: {
                orders: [
                    'id',
                    'number',
                    'formatted_subtotal_amount',
                    'formatted_shipping_amount',
                    'formatted_discount_amount',
                    'formatted_total_amount',
                    'line_items',
                ],
                line_items: [
                    'id',
                    'sku_code',
                    'name',
                    'quantity',
                    'formatted_unit_amount',
                    'formatted_total_amount',
                    'image_url',
                ],
            },
            include: ['line_items'],
        });
        const lineItems = get(order, 'line_items', [] as LineItem[]);
        const skus = lineItems.map((item) => item.sku_code || '').filter((item) => item.length > 0);

        const skuItems = await cl.skus.list({
            fields: {
                skus: ['id', 'code'],
            },
            filters: { code_in: join(skus, ',') },
            pageNumber: 0,
            pageSize: skus.length,
        });

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const skuItemsWithStock: any[] = [];

        for (const skuItem of skuItems) {
            const skuInventory = await cl.skus.retrieve(skuItem.id, {
                fields: {
                    skus: ['inventory'],
                },
            });
            const stock = safelyParse(skuInventory, 'inventory.quantity', parseAsNumber, 0);

            skuItemsWithStock.push({ id: skuItem.id, code: skuItem.code, stock });
        }

        return {
            ...order,
            line_items: lineItems.map((item) => {
                const skuItemWithStock = skuItemsWithStock.find((skWS) => item.sku_code === skWS.code);

                return {
                    id: safelyParse(item, 'id', parseAsString, ''),
                    sku_code: safelyParse(item, 'sku_code', parseAsString, ''),
                    name: safelyParse(item, 'name', parseAsString, ''),
                    quantity: safelyParse(item, 'quantity', parseAsNumber, 0),
                    formatted_unit_amount: safelyParse(item, 'formatted_unit_amount', parseAsString, '£0.00'),
                    formatted_total_amount: safelyParse(item, 'formatted_total_amount', parseAsString, '£0.00'),
                    image: {
                        title: '',
                        description: '',
                        url: safelyParse(item, 'image_url', parseAsString, ''),
                    },
                    stock: safelyParse(skuItemWithStock, 'stock', parseAsNumber, 0),
                    line_item_options: item.line_item_options || [],
                };
            }),
        };
    } catch (error: unknown) {
        errorHandler(error, 'Failed to fetch order by id.');
    }

    return null;
}

export async function setLineItem(
    accessToken: string,
    attributes: LineItemAttributes,
    relationships: LineItemRelationships
): Promise<string | null> {
    try {
        const cl = authClient(accessToken);
        const res = await cl.post('/api/line_items', {
            data: {
                type: 'line_items',
                attributes,
                relationships,
            },
        });

        return safelyParse(res, 'data.data.id', parseAsString, null);
    } catch (error: unknown) {
        errorHandler(error, 'We could not fetch an order.');
    }

    return null;
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

export async function createLineItemOption(
    accessToken: string,
    lineItemId: string,
    savedSkuOptions: SavedSkuOptions
): Promise<string | null> {
    try {
        const cl = CommerceLayer({
            organization: process.env.NEXT_PUBLIC_ECOM_SLUG || '',
            accessToken,
        });
        const { id, quantity, amount, name } = savedSkuOptions;

        const res = await cl.line_item_options.create({
            line_item: {
                type: 'line_items',
                id: lineItemId,
            },
            sku_option: {
                type: 'sku_options',
                id,
            },
            quantity,
            options: {
                Addon: `${name} - ${amount} - x${quantity}`,
            },
        });

        return res.id;
    } catch (error: unknown) {
        errorHandler(error, 'We could not fetch an order.');
    }

    return null;
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

export async function updateOrderWithBlankAttributes(accessToken: string, orderId: string): Promise<void> {
    try {
        const cl = authClient(accessToken);
        await cl.patch(`/orders/${orderId}`, {
            data: {
                type: 'orders',
                id: orderId,
                attributes: {},
            },
        });
    } catch (error: unknown) {
        errorHandler(error, 'We could not update your order.');
    }
}
