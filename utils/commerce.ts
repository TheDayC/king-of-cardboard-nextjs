import { getSalesChannelToken } from '@commercelayer/js-auth';
import CommerceLayer, { CommerceLayerClient } from '@commercelayer/sdk';
import axios from 'axios';
import { get } from 'lodash';
import { DateTime } from 'luxon';

import { IncludedData, Order } from '../types/cart';
import { CommerceAuthProps, LineItemAttributes, LineItemRelationships, Price, StockItem } from '../types/commerce';

export async function getCommerceAuth(): Promise<CommerceAuthProps | null> {
    const token = await getSalesChannelToken({
        clientId: process.env.NEXT_PUBLIC_ECOM_CLIENT_ID || '',
        endpoint: process.env.NEXT_PUBLIC_ECOM_DOMAIN || '',
        scope: 'market:6098',
    });

    if (token) {
        const parsedDate = token.expires ? DateTime.fromJSDate(token.expires) : null;
        const isoDate = parsedDate ? parsedDate.toISO() : '';

        return {
            accessToken: token.accessToken,
            expires: isoDate,
        };
    }

    return null;
}

export function initCommerceClient(accessToken: string): CommerceLayerClient {
    const cl = CommerceLayer({
        accessToken: accessToken,
        organization: process.env.NEXT_PUBLIC_ORG_SLUG || '',
    });

    return cl;
}

export async function createOrder(accessToken: string): Promise<Order | null> {
    try {
        const response = await axios.post('/api/createOrder', {
            token: accessToken,
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

export async function getStockItems(accessToken: string): Promise<StockItem[] | null> {
    try {
        const response = await axios.post('/api/stockItems', {
            token: accessToken,
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
            orderId,
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

function parseOrderData(order: unknown, included: unknown): Order | null {
    if (order !== null) {
        const id: string = get(order, 'id', '');
        const orderNumber: number = get(order, 'attributes.number', 0);
        const sku_count: number = get(order, 'attributes.sku_count', 0);
        const formatted_subtotal_amount: string = get(order, 'attributes.formatted_subtotal_amount', '£0.00');
        const formatted_discount_amount: string = get(order, 'attributes.formatted_discount_amount', '£0.00');
        const formatted_shipping_amount: string = get(order, 'attributes.formatted_shipping_amount', '£0.00');
        const formatted_total_tax_amount: string = get(order, 'attributes.formatted_total_tax_amount', '£0.00');
        const formatted_gift_card_amount: string = get(order, 'attributes.formatted_gift_card_amount', '£0.00');
        const formatted_total_amount_with_taxes: string = get(
            order,
            'attributes.formatted_total_amount_with_taxes',
            '£0.00'
        );
        const line_items: string[] = get(order, 'attributes.line_items', []);

        return {
            id,
            number: orderNumber,
            sku_count,
            formatted_subtotal_amount,
            formatted_discount_amount,
            formatted_shipping_amount,
            formatted_total_tax_amount,
            formatted_gift_card_amount,
            formatted_total_amount_with_taxes,
            line_items,
            included: included
                ? included.map((include) => {
                      const id: string = get(include, 'id', '');
                      const type: string = get(include, 'type', '');
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      const attributes: any = get(include, 'attributes', null);

                      return {
                          id,
                          type,
                          attributes,
                      };
                  })
                : [],
        };
    }

    return null;
}
