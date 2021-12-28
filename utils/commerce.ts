/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';
import { get } from 'lodash';

import { errorHandler } from '../middleware/errors';
import { ErrorResponse, PaymentSourceResponse } from '../types/api';
import { Order } from '../types/cart';
import { LineItemAttributes, LineItemRelationships, Price, StockItem, SkuItem, SkuProduct } from '../types/commerce';
import { authClient } from './auth';
import { parseAsString, parseOrderData, safelyParse } from './parsers';

export async function createOrder(accessToken: string): Promise<Order | ErrorResponse | ErrorResponse[] | null> {
    try {
        const cl = authClient(accessToken);
        const res = await cl.post('/api/orders', {
            data: {
                type: 'orders',
                attributes: {
                    guest: true,
                },
            },
        });

        if (res) {
            const order: unknown = get(res, 'data.order', null);
            const included: unknown[] = get(res, 'data.included', []);

            return parseOrderData(order, included);
        }

        return null;
    } catch (error: unknown) {
        return errorHandler(error, 'We could not create your order.');
    }
}

export async function getStockItems(accessToken: string, sku_codes: string[]): Promise<StockItem[] | null> {
    try {
        const response = await axios.post('/api/stockItems', {
            token: accessToken,
            sku_codes,
        });

        if (response) {
            const stockItems = get(response, 'data.stockItems', null);

            return stockItems.map((item: unknown) => {
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

export async function getSkus(accessToken: string, sku_codes: string[]): Promise<SkuItem[] | null> {
    try {
        const response = await axios.post('/api/getSkus', {
            token: accessToken,
            sku_codes,
        });

        if (response) {
            const skuItems = get(response, 'data.skuItems', null);
            const included = get(response, 'data.included', null);

            return skuItems.map((item: unknown) => {
                const id = get(item, 'id', '');
                const sku_code = get(item, 'attributes.code', '');
                const image_url = get(item, 'attributes.image_url', '');
                const name = get(item, 'attributes.name', '');

                // Find price data
                const prices = included.find((i: any) => i.type === 'prices' && i.attributes.sku_code === sku_code);
                const amount = get(prices, 'attributes.formatted_amount', '');
                const compare_amount = get(prices, 'attributes.formatted_compare_at_amount', '');

                return {
                    id,
                    sku_code,
                    image_url,
                    name,
                    amount,
                    compare_amount,
                };
            });
        }

        return null;
    } catch (error) {
        console.log('Error: ', error);
    }

    return null;
}

export async function getSkuDetails(accessToken: string, id: string): Promise<SkuProduct | null> {
    try {
        const response = await axios.post('/api/getSku', {
            token: accessToken,
            id,
        });

        if (response) {
            const skuItem = get(response, 'data.skuItem', null);
            const included = get(response, 'data.included', null);

            const inventory = get(skuItem, 'attributes.inventory', '');

            // Find price data
            const prices = included.find((i: any) => i.type === 'prices');
            const formatted_amount = get(prices, 'attributes.formatted_amount', '');
            const formatted_compare_at_amount = get(prices, 'attributes.formatted_compare_at_amount', '');

            // options data
            const sku_options = included.filter((i: any) => i.type === 'sku_options') || null;

            return {
                formatted_amount,
                formatted_compare_at_amount,
                inventory,
                options: sku_options.map((option: any) => ({
                    id: get(option, 'id', ''),
                    name: get(option, 'attributes.name', ''),
                    formatted_price_amount: get(option, 'attributes.formatted_price_amount', ''),
                    description: get(option, 'attributes.description', ''),
                    reference: get(option, 'attributes.reference', ''),
                    price_amount_cents: get(option, 'attributes.price_amount_cents', 0),
                    price_amount_float: get(option, 'attributes.price_amount_float', 0),
                    sku_code_regex: get(option, 'attributes.sku_code_regex', ''),
                    delay_days: get(option, 'attributes.delay_days', 0),
                    delay_hours: get(option, 'attributes.delay_hours', 0),
                })),
            };
        }

        return null;
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

            return prices.map((price: unknown) => {
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
        }
    } catch (error) {
        console.log('Error: ', error);
    }

    return null;
}

export async function getOrder(accessToken: string, orderId: string, include: string[]): Promise<Order | null> {
    try {
        const response = await axios.post('/api/getOrder', {
            token: accessToken,
            id: orderId,
            include,
        });

        if (response) {
            const order: any[] | null = get(response, 'data.order', null);
            const included: any[] | null = get(response, 'data.included', null);

            return parseOrderData(order, included);
        }

        return null;
    } catch (error) {
        console.log('Error: ', error);
    }

    return null;
}

export async function setLineItem(
    accessToken: string,
    attributes: LineItemAttributes,
    relationships: LineItemRelationships
): Promise<boolean> {
    try {
        const response = await axios.post('/api/lineItems', {
            token: accessToken,
            attributes,
            relationships,
        });

        if (response) {
            const hasUpdated: boolean = get(response, 'data.hasUpdated', false);

            return hasUpdated;
        }
    } catch (error) {
        console.log('Error: ', error);
    }

    return false;
}

export async function removeLineItem(accessToken: string, id: string): Promise<boolean> {
    try {
        const response = await axios.post('/api/removeLineItem', {
            token: accessToken,
            id,
        });

        if (response) {
            const hasDeleted: boolean = get(response, 'data.deleted', false);

            return hasDeleted;
        }
    } catch (error) {
        console.log('Error: ', error);
    }

    return false;
}

export async function updateLineItem(accessToken: string, id: string, quantity: number): Promise<boolean> {
    try {
        const response = await axios.post('/api/updateLineItem', {
            token: accessToken,
            id,
            quantity,
        });

        if (response) {
            const hasUpdated: boolean = get(response, 'data.hasUpdated', false);

            return hasUpdated;
        }
    } catch (error) {
        console.log('Error: ', error);
    }

    return false;
}

export async function createPaymentSource(
    accessToken: string,
    id: string,
    paymentSourceType: string
): Promise<PaymentSourceResponse> {
    try {
        const response = await axios.post('/api/createPaymentSource', {
            token: accessToken,
            id,
            paymentSourceType,
        });

        if (response) {
            const paymentId = safelyParse(response, 'data.paymentId', parseAsString, null);
            const clientSecret = safelyParse(response, 'data.clientSecret', parseAsString, null);

            return {
                paymentId,
                clientSecret,
            };
        }
    } catch (error) {
        console.log('Error: ', error);
    }

    return {
        paymentId: null,
        clientSecret: null,
    };
}
