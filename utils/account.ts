import axios from 'axios';

import { GetOrders } from '../types/account';
import { parseAsCommerceResponseArray, safelyParse } from './parsers';

export async function getOrders(
    accessToken: string,
    emailAddress: string,
    pageSize: number,
    page: number
): Promise<GetOrders | null> {
    try {
        const response = await axios.post('/api/account/getOrders', {
            token: accessToken,
            emailAddress,
            pageSize,
            page,
        });

        if (response) {
            const orders = safelyParse(response, 'data.orders', parseAsCommerceResponseArray, null);
            const included = safelyParse(response, 'data.included', parseAsCommerceResponseArray, null);

            return { orders, included };
        }

        return null;
    } catch (error) {
        console.log('Error: ', error);
    }

    return null;
}
