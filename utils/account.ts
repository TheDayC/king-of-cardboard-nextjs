import axios from 'axios';
import { get } from 'lodash';

import { Order } from '../types/cart';
import { parseOrderData } from './parsers';

export async function getOrders(
    accessToken: string,
    emailAddress: string,
    pageSize: number,
    page: number
): Promise<Order | null> {
    try {
        const response = await axios.post('/api/account/getOrders', {
            token: accessToken,
            emailAddress,
            pageSize,
            page,
        });

        if (response) {
            const order: any[] | null = get(response, 'data.order', null);
            const included: any[] | null = get(response, 'data.included', null);

            return parseOrderData(order, included);
        }

        return null;
    } catch (error) {
        console.log('Error: ', error);
    }

    return null;
}
