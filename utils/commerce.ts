/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';
import { get, join } from 'lodash';

import { errorHandler } from '../middleware/errors';
import { ErrorResponse, PaymentSourceResponse } from '../types/api';
import { Order } from '../types/cart';
import { LineItemAttributes, LineItemRelationships, Price, StockItem, SkuItem, SkuProduct } from '../types/commerce';
import { authClient } from './auth';
import {
    parseAsCommerceResponse,
    parseAsString,
    parseOrderData,
    safelyParse,
    parseAsSkuInventory,
    parseAsArrayOfCommerceResponse,
    parseAsNumber,
} from './parsers';

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

export async function getSkus(
    accessToken: string,
    sku_codes: string[]
): Promise<SkuItem[] | ErrorResponse | ErrorResponse[] | null> {
    try {
        const cl = authClient(accessToken);
        const skuFilter = join(sku_codes, ',');
        const fields =
            '&fields[skus]=code,image_url,name&fields[prices]=sku_code,formatted_amount,formatted_compare_at_amount';
        const res = await cl.get(
            `/api/skus?filter[q][code_in]=${skuFilter}&filter[q][stock_items_quantity_gt]=0&include=prices${fields}`
        );
        const skuItems = safelyParse(res, 'data.data', parseAsArrayOfCommerceResponse, null);
        const included = safelyParse(res, 'data.included', parseAsArrayOfCommerceResponse, null);

        if (!skuItems) {
            return null;
        }

        return skuItems.map((item) => {
            const sku_code = safelyParse(item, 'attributes.code', parseAsString, '');

            // Find price data
            const prices = included
                ? included.find((i) => i.type === 'prices' && i.attributes.sku_code === sku_code)
                : {};
            const amount = safelyParse(prices, 'attributes.formatted_amount', parseAsString, '');
            const compare_amount = safelyParse(prices, 'attributes.formatted_compare_at_amount', parseAsString, '');

            return {
                id: safelyParse(item, 'id', parseAsString, ''),
                sku_code,
                image_url: safelyParse(item, 'attributes.image_url', parseAsString, ''),
                name: safelyParse(item, 'attributes.name', parseAsString, ''),
                amount,
                compare_amount,
            };
        });
    } catch (error: unknown) {
        return errorHandler(error, 'We could not get a shipment.');
    }
}

export async function getSkuDetails(
    accessToken: string,
    id: string
): Promise<SkuProduct | ErrorResponse | ErrorResponse[] | null> {
    try {
        const cl = authClient(accessToken);
        const res = await cl.get(`/api/skus/${id}?include=prices,sku_options`);
        const skuItem = safelyParse(res, 'data.data', parseAsCommerceResponse, null);
        const included = safelyParse(res, 'data.included', parseAsArrayOfCommerceResponse, null);
        const inventory = safelyParse(skuItem, 'attributes.inventory', parseAsSkuInventory, null);

        if (!included) {
            return null;
        }

        // Find price data
        const prices = included.find((i) => i.type === 'prices');
        const formatted_amount = safelyParse(prices, 'attributes.formatted_amount', parseAsString, '');
        const formatted_compare_at_amount = safelyParse(
            prices,
            'attributes.formatted_compare_at_amount',
            parseAsString,
            ''
        );

        // options data
        const sku_options = included.filter((i) => i.type === 'sku_options');

        return {
            formatted_amount,
            formatted_compare_at_amount,
            inventory,
            options: sku_options.map((option) => ({
                id: safelyParse(option, 'id', parseAsString, ''),
                name: safelyParse(option, 'attributes.name', parseAsString, ''),
                formatted_price_amount: safelyParse(option, 'attributes.formatted_price_amount', parseAsString, ''),
                description: safelyParse(option, 'attributes.description', parseAsString, ''),
                reference: safelyParse(option, 'attributes.reference', parseAsString, ''),
                price_amount_cents: safelyParse(option, 'attributes.price_amount_cents', parseAsNumber, 0),
                price_amount_float: safelyParse(option, 'attributes.price_amount_float', parseAsNumber, 0),
                sku_code_regex: safelyParse(option, 'attributes.sku_code_regex', parseAsString, ''),
                delay_days: safelyParse(option, 'attributes.delay_days', parseAsNumber, 0),
                delay_hours: safelyParse(option, 'attributes.delay_hours', parseAsNumber, 0),
            })),
        };
    } catch (error: unknown) {
        return errorHandler(error, 'We could not get a shipment.');
    }
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

export async function getOrder(
    accessToken: string,
    orderId: string,
    include: string[]
): Promise<Order | ErrorResponse | ErrorResponse[] | null> {
    try {
        const includeJoin = join(include, ',');
        const orderFields =
            'fields[orders]=number,skus_count,formatted_subtotal_amount,formatted_discount_amount,formatted_shipping_amount,formatted_total_tax_amount,formatted_gift_card_amount,formatted_total_amount_with_taxes,line_items,shipments_count,status,payment_status,fulfillment_status';
        const lineItemFields =
            'fields[line_items]=item_type,image_url,name,sku_code,formatted_unit_amount,quantity,formatted_total_amount,metadata';
        const paymentFields = 'fields[payment_methods]=id,name,payment_source_type';
        const shipmentsFields = 'fields[shipments]=id,status,currency_code,cost_amount_cents';

        const apiUrl = include
            ? `/api/orders/${orderId}?include=${includeJoin}&${orderFields}&${lineItemFields}&${paymentFields}&${shipmentsFields}`
            : `/api/orders/${orderId}`;

        const cl = authClient(accessToken);
        const res = await cl.get(apiUrl);

        const order: unknown = get(res, 'data.order', null);
        const included: unknown[] = get(res, 'data.included', null);

        return parseOrderData(order, included);
    } catch (error: unknown) {
        return errorHandler(error, 'We could not fetch an order.');
    }
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
): Promise<PaymentSourceResponse | ErrorResponse | ErrorResponse[]> {
    try {
        const cl = authClient(accessToken);
        const res = cl.post(`/api/${paymentSourceType}`, {
            data: {
                type: paymentSourceType,
                attributes: {},
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

        const paymentId = safelyParse(res, 'data.data.id', parseAsString, null);
        const clientSecret = safelyParse(res, 'data.data.attributes.client_secret', parseAsString, null);

        return { paymentId, clientSecret };
    } catch (error: unknown) {
        return errorHandler(error, 'We could not create a payment source.');
    }
}
