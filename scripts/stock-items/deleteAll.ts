import path from 'path';
import * as dotenv from 'dotenv';
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

import { authClient } from '../../utils/auth';
import { parseAsArrayOfCommerceResponse, safelyParse } from '../../utils/parsers';
import { createToken } from '../token';
import { errorHandler } from '../../middleware/errors';

async function deleteAllStockItems(): Promise<void> {
    try {
        const token = await createToken();
        const cl = authClient(token);
        const orderIdsRes = await cl.get('/api/stock_items/?fields[stock_items]=id&page[size]=25&page[number]=1');
        const stockItems = safelyParse(orderIdsRes, 'data.data', parseAsArrayOfCommerceResponse, []);

        for (const stockItem of stockItems) {
            const res = await cl.delete(`/api/stock_items/${stockItem.id}`);
            console.log('🚀 ~ file: deleteAll.ts ~ line 19 ~ deleteAllLineItems ~ res', res.status);
        }
    } catch (err: unknown) {
        errorHandler(err, 'An error occurred.');
    }
}

deleteAllStockItems();
