import { errorHandler } from '../middleware/errors';
import { CartTotals } from '../types/cart';
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

export async function getCartTotals(accessToken: string, orderId: string): Promise<CartTotals> {
    try {
        const cl = authClient(accessToken);
        const fields = 'formatted_subtotal_amount,formatted_shipping_amount,formatted_total_amount_with_taxes';
        const res = await cl.get(`/api/orders/${orderId}?fields[orders]=${fields}`);
        console.log('🚀 ~ file: cart.ts ~ line 24 ~ getCartTotals ~ res', res);
    } catch (error: unknown) {
        errorHandler(error, 'Failed to fetch cart item count.');
    }

    return {
        subTotal: null,
        shipping: null,
        total: null,
    };
}
