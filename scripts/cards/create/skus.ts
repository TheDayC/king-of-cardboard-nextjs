import path from 'path';
import * as dotenv from 'dotenv';
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

import { authClient } from '../../../utils/auth';
import { parseAsString, safelyParse } from '../../../utils/parsers';
import { createToken } from '../../token';
import { errorHandler } from '../../../middleware/errors';
import { Card, SkusWithIds } from '../../types';

export async function createSkus(cards: Card[]): Promise<SkusWithIds[]> {
    const skusWithIds = [];

    try {
        const token = await createToken();
        const cl = authClient(token);

        for (const card of cards) {
            const skuRes = await cl.post(`/api/skus`, {
                data: {
                    type: 'skus',
                    attributes: {
                        code: card.sku,
                        name: card.name,
                        image_url: card.image_url,
                    },
                    relationships: {
                        shipping_category: {
                            data: {
                                type: 'shipping_categories',
                                id: process.env.NEXT_PUBLIC_SHIPPING_CATEGORY_SINGLES, // Singles category
                            },
                        },
                    },
                },
            });
            const skuId = safelyParse(skuRes, 'data.data.id', parseAsString, '');

            await cl.post(`/api/stock_items`, {
                data: {
                    type: 'stock_items',
                    attributes: {
                        sku_code: card.sku,
                        quantity: card.quantity,
                    },
                    relationships: {
                        stock_location: {
                            data: {
                                type: 'stock_locations',
                                id: process.env.NEXT_PUBLIC_STOCK_LOCATIONS || '', // Warehouse
                            },
                        },
                        sku: {
                            data: {
                                type: 'skus',
                                id: skuId,
                            },
                        },
                    },
                },
            });

            await cl.post(`/api/prices`, {
                data: {
                    type: 'prices',
                    attributes: {
                        sku_code: card.sku,
                        amount_cents: card.amount,
                    },
                    relationships: {
                        price_list: {
                            data: {
                                type: 'price_lists',
                                id: 'jLDqQCggRB', // UK price list
                            },
                        },
                    },
                },
            });
            skusWithIds.push({ code: card.sku, id: skuId });
            console.log(`Created SKU: ${card.sku}`);
        }

        return skusWithIds;
    } catch (err: unknown) {
        errorHandler(err, 'An error occurred.');
    }

    return skusWithIds;
}
