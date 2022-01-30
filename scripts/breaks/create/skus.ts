import path from 'path';
import * as dotenv from 'dotenv';
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

import { authClient } from '../../../utils/auth';
import { parseAsString, safelyParse } from '../../../utils/parsers';
import { createToken } from '../../token';
import { errorHandler } from '../../../middleware/errors';
import { Card, SkusWithIds, Team } from '../../types';

export async function createSkus(teams: Team[]): Promise<SkusWithIds[]> {
    const skusWithIds = [];

    try {
        const token = await createToken();
        const cl = authClient(token);

        for (const team of teams) {
            const skuRes = await cl.post(`/api/skus`, {
                data: {
                    type: 'skus',
                    attributes: {
                        code: team.sku,
                        name: team.name,
                        image_url: team.image_url,
                    },
                    relationships: {
                        shipping_category: {
                            data: {
                                type: 'shipping_categories',
                                id: process.env.NEXT_PUBLIC_SHIPPING_CATEGORY_BREAKS, // Breaks category
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
                        sku_code: team.sku,
                        quantity: 1,
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
                        sku_code: team.sku,
                        amount_cents: team.amount,
                    },
                    relationships: {
                        price_list: {
                            data: {
                                type: 'price_lists',
                                id: process.env.NEXT_PUBLIC_SHIPPING_PRICE_LIST, // UK price list
                            },
                        },
                    },
                },
            });
            skusWithIds.push({ code: team.code, id: skuId });
            console.log(`Created SKU: ${team.code}`);
        }

        return skusWithIds;
    } catch (err: unknown) {
        errorHandler(err, 'An error occurred.');
    }

    return skusWithIds;
}
