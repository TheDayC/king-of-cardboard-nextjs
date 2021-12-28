import axios from 'axios';
import { get } from 'react-hook-form';

import { CartItem, CustomerDetails } from '../store/types/state';
import { Order } from '../types/cart';
import { parseAsBoolean, safelyParse } from './parsers';

export async function confirmOrder(accessToken: string, orderId: string, attribute: string): Promise<boolean> {
    try {
        const response = await axios.post('/api/confirmOrder', {
            token: accessToken,
            id: orderId,
            attribute,
        });

        if (response) {
            const hasPlaced: boolean = get(response, 'data.hasPlaced', false);

            return hasPlaced;
        }

        return false;
    } catch (error) {
        console.log('Error: ', error);
    }

    return false;
}

export async function refreshPayment(accessToken: string, id: string, paymentSourceType: string): Promise<boolean> {
    try {
        const response = await axios.post('/api/refreshPaymentSource', {
            token: accessToken,
            id,
            paymentSourceType,
        });

        if (response) {
            const hasPlaced: boolean = get(response, 'data.hasPlaced', false);

            return hasPlaced;
        }

        return false;
    } catch (error) {
        console.log('Error: ', error);
    }

    return false;
}

export async function sendOrderConfirmation(
    order: Order,
    items: CartItem[],
    customerDetails: CustomerDetails
): Promise<boolean> {
    try {
        const response = await axios.post('/api/sendOrderConfirmation', {
            order,
            items,
            customerDetails,
        });

        return safelyParse(response, 'data.hasSent', parseAsBoolean, false);
    } catch (error) {
        console.log('Error: ', error);
    }

    return false;
}
