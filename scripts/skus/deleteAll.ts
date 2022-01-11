import path from 'path';
import * as dotenv from 'dotenv';
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

import { authClient } from '../../utils/auth';
import { parseAsArrayOfCommerceResponse, safelyParse } from '../../utils/parsers';
import { createToken } from '../token';
import { errorHandler } from '../../middleware/errors';

async function deleteAllSkus(): Promise<void> {
    try {
        const token = await createToken();
        const cl = authClient(token);
        const orderIdsRes = await cl.get('/api/skus/?fields[skus]=id&page[size]=25&page[number]=1');
        const skus = safelyParse(orderIdsRes, 'data.data', parseAsArrayOfCommerceResponse, []);

        for (const sku of skus) {
            const res = await cl.delete(`/api/skus/${sku.id}`);
            console.log('🚀 ~ file: deleteAll.ts ~ line 19 ~ deleteAllSkus ~ res', res.status);
        }
    } catch (err: unknown) {
        errorHandler(err, 'An error occurred.');
    }
}

deleteAllSkus();
