import axios from 'axios';
import { get } from 'react-hook-form';

export async function checkoutOrder(clientSecret: string): Promise<string | null> {
    try {
        const response = await axios.post('/api/checkoutOrder', {
            clientSecret,
        });

        if (response) {
            const status: string | null = get(response, 'data.status', null);

            if (status) {
                return status;
            }

            return null;
        }
    } catch (error) {
        console.log('Error: ', error);
    }

    return null;
}

export async function confirmOrder(accessToken: string, orderId: string): Promise<boolean> {
    try {
        const response = await axios.post('/api/confirmOrder', {
            token: accessToken,
            id: orderId,
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
