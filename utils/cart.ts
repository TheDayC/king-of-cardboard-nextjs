import { errorHandler } from '../middleware/errors';
import { authClient } from './auth';
import { parseAsNumber, safelyParse } from './parsers';

export async function getItemCount(accessToken: string, orderId: string): Promise<number> {
    try {
        const cl = authClient(accessToken);
        const res = await cl.get(`/api/orders/${orderId}?fields[orders]=skus_count`);

        return safelyParse(res, 'data.data.attributes.skus_count', parseAsNumber, 0);
    } catch (error: unknown) {
        errorHandler(error, 'Failed to fetch cart item count.');
    }

    return 0;
}
