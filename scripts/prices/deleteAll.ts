import path from 'path';
import * as dotenv from 'dotenv';
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

import { authClient } from '../../utils/auth';
import { parseAsArrayOfCommerceResponse, safelyParse } from '../../utils/parsers';
import { createToken } from '../token';
import { errorHandler } from '../../middleware/errors';

async function deleteAllPrices(): Promise<void> {
    try {
        const token = await createToken();
        const cl = authClient(token);
        const orderIdsRes = await cl.get('/api/prices/?fields[prices]=id&page[size]=25&page[number]=1');
        const prices = safelyParse(orderIdsRes, 'data.data', parseAsArrayOfCommerceResponse, []);

        for (const price of prices) {
            const res = await cl.delete(`/api/prices/${price.id}`);
            console.log('🚀 ~ file: deleteAll.ts ~ line 19 ~ deleteAllPrices ~ res', res.status);
        }
    } catch (err: unknown) {
        errorHandler(err, 'An error occurred.');
    }
}

deleteAllPrices();
