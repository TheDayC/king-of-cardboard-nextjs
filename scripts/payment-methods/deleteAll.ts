import path from 'path';
import * as dotenv from 'dotenv';
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

import { authClient } from '../../utils/auth';
import { parseAsArrayOfCommerceResponse, safelyParse } from '../../utils/parsers';
import { createToken } from '../token';
import { errorHandler } from '../../middleware/errors';

async function deleteAllPaymentMethods(): Promise<boolean> {
    try {
        const token = await createToken();
        const cl = authClient(token);
        const orderIdsRes = await cl.get(
            '/api/payment_methods/?fields[payment_methods]=id&page[size]=25&page[number]=1'
        );
        const paymentMethods = safelyParse(orderIdsRes, 'data.data', parseAsArrayOfCommerceResponse, []);

        for (const paymentMethod of paymentMethods) {
            const res = await cl.delete(`/api/payment_methods/${paymentMethod.id}`);
            console.log('🚀 ~ file: deleteAll.ts ~ line 19 ~ deleteAllOrders ~ res', res.status);
        }

        return true;
    } catch (err: unknown) {
        errorHandler(err, 'An error occurred.');
    }

    return false;
}

deleteAllPaymentMethods();
