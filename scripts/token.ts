import path from 'path';
import * as dotenv from 'dotenv';
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

import { authClient } from '../utils/auth';
import { parseAsString, safelyParse } from '../utils/parsers';
import { errorHandler } from '../middleware/errors';

export async function createToken(): Promise<string | null> {
    try {
        const cl = authClient();
        const res = await cl.post('/oauth/token', {
            grant_type: 'client_credentials',
            client_id: process.env.ECOM_CLIENT_ID,
            client_secret: process.env.ECOM_CLIENT_SECRET,
            scope: 'market:6098',
        });

        return safelyParse(res, 'data.access_token', parseAsString, null);
    } catch (err: unknown) {
        errorHandler(err, 'An error occurred.');
    }

    return null;
}
