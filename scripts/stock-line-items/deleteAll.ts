import path from 'path';
import * as dotenv from 'dotenv';
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

import { authClient } from '../../utils/auth';
import { parseAsArrayOfCommerceResponse, safelyParse } from '../../utils/parsers';
import { createToken } from '../token';
import { errorHandler } from '../../middleware/errors';

async function deleteAllStockLineItems(): Promise<void> {
    try {
        const token = await createToken();
        const cl = authClient(token);
        const orderIdsRes = await cl.get(
            '/api/stock_line_items/?fields[stock_line_items]=id&page[size]=25&page[number]=1'
        );
        const stockLineItems = safelyParse(orderIdsRes, 'data.data', parseAsArrayOfCommerceResponse, []);

        for (const stockLineItem of stockLineItems) {
            const res = await cl.delete(`/api/stock_line_items/${stockLineItem.id}`);
            console.log('🚀 ~ file: deleteAll.ts ~ line 19 ~ deleteAllStockLineItems ~ res', res.status);
        }
    } catch (err: unknown) {
        errorHandler(err, 'An error occurred.');
    }
}

deleteAllStockLineItems();
