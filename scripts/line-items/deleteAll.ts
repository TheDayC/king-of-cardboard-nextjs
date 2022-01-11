import path from 'path';
import * as dotenv from 'dotenv';
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

import { authClient } from '../../utils/auth';
import { parseAsArrayOfCommerceResponse, safelyParse } from '../../utils/parsers';
import { createToken } from '../token';
import { errorHandler } from '../../middleware/errors';

async function deleteAllLineItems(): Promise<void> {
    try {
        const token = await createToken();
        const cl = authClient(token);
        const orderIdsRes = await cl.get('/api/line_items/?fields[line_items]=id&page[size]=25&page[number]=1');
        const lineItems = safelyParse(orderIdsRes, 'data.data', parseAsArrayOfCommerceResponse, []);

        for (const lineItem of lineItems) {
            const res = await cl.delete(`/api/line_items/${lineItem.id}`);
            console.log('🚀 ~ file: deleteAll.ts ~ line 19 ~ deleteAllLineItems ~ res', res.status);
        }
    } catch (err: unknown) {
        errorHandler(err, 'An error occurred.');
    }
}

deleteAllLineItems();
