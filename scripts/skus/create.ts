import path from 'path';
import * as dotenv from 'dotenv';
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

import { authClient } from '../../utils/auth';
import {
    parseAsArrayOfCommerceResponse,
    parseAsCommerceResponse,
    parseAsString,
    safelyParse,
} from '../../utils/parsers';
import { createToken } from '../token';
import { errorHandler } from '../../middleware/errors';
import { premierLeaguePrizmSlots } from './soccerData';

async function createSkus(): Promise<boolean> {
    try {
        const token = await createToken();
        const cl = authClient(token);

        for (const slot of premierLeaguePrizmSlots) {
            const skuRes = await cl.post(`/api/skus`, {
                data: {
                    type: 'skus',
                    attributes: {
                        code: slot.code,
                        name: slot.name,
                        image_url: slot.image_url,
                    },
                    relationships: {
                        shipping_category: {
                            data: {
                                type: 'shipping_categories',
                                id: 'MWjgYFVZLK', // Break category
                            },
                        },
                    },
                },
            });
            const skuId = safelyParse(skuRes, 'data.data.id', parseAsString, '');
            console.log('🚀 ~ file: create.ts ~ line 36 ~ createSkus ~ skuId', skuId);

            const stockItemsRes = await cl.post(`/api/stock_items`, {
                data: {
                    type: 'stock_items',
                    attributes: {
                        sku_code: slot.code,
                        quantity: 1,
                    },
                    relationships: {
                        stock_location: {
                            data: {
                                type: 'stock_locations',
                                id: 'qnPbeuJNWk', // Warehouse
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

            const pricesRes = await cl.post(`/api/prices`, {
                data: {
                    type: 'prices',
                    attributes: {
                        sku_code: slot.code,
                        amount_cents: slot.amount,
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
            console.log('🚀 ~ file: create.ts ~ line 78 ~ createSkus ~ pricesRes', pricesRes.status);
        }

        return true;
    } catch (err: unknown) {
        errorHandler(err, 'An error occurred.');
    }

    return false;
}

createSkus();
