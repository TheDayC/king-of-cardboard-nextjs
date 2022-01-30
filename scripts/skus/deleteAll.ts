import path from 'path';
import * as dotenv from 'dotenv';
dotenv.config({ path: path.resolve(process.cwd(), '.env') });
import { join } from 'lodash';

import { authClient } from '../../utils/auth';
import {
    parseAsArrayOfCommerceLayerErrors,
    parseAsArrayOfCommerceResponse,
    parseAsNumber,
    safelyParse,
} from '../../utils/parsers';
import { createToken } from '../token';
import { errorHandler } from '../../middleware/errors';
async function deleteAllSkus(): Promise<void> {
    try {
        const token = await createToken();
        const cl = authClient(token);
        const orderIdsRes = await cl.get('/api/skus/?fields[skus]=id,code&page[size]=25&page[number]=1');
        const skus = safelyParse(orderIdsRes, 'data.data', parseAsArrayOfCommerceResponse, []);

        if (skus.length <= 0) {
            console.log('No skus found!');
            return;
        }

        const skusString = join(
            skus.map((sku) => sku.attributes.code),
            ','
        );

        // Delete Prices first.
        const priceIdRes = await cl.get(
            `/api/prices/?fields[prices]=id&page[size]=25&page[number]=1&filter[q][sku_code_in]=${skusString}`
        );
        const prices = safelyParse(priceIdRes, 'data.data', parseAsArrayOfCommerceResponse, []);

        for (const price of prices) {
            const res = await cl.delete(`/api/prices/${price.id}`);
            const status = safelyParse(res, 'status', parseAsNumber, 500);

            console.log(`Tried to delete price - ${price.id} - status: ${status}`);
        }

        // Then delete Inventory (stock_items).
        const stockItemsIdsRes = await cl.get(
            `/api/stock_items/?fields[stock_items]=id&page[size]=25&page[number]=1&filter[q][sku_code_in]=${skusString}`
        );
        const stockItems = safelyParse(stockItemsIdsRes, 'data.data', parseAsArrayOfCommerceResponse, []);

        for (const stockItem of stockItems) {
            const res = await cl.delete(`/api/stock_items/${stockItem.id}`);
            const status = safelyParse(res, 'status', parseAsNumber, 500);

            console.log(`Tried to delete stock item - ${stockItem.id} - status: ${status}`);
        }

        for (const sku of skus) {
            const res = await cl.delete(`/api/skus/${sku.id}`);
            const status = safelyParse(res, 'status', parseAsNumber, 500);

            console.log(`Tried to delete sku - ${sku.id} - status: ${status}`);
        }
    } catch (err: unknown) {
        errorHandler(err, 'An error occurred.');
    }
}

deleteAllSkus();
