import axios from 'axios';

import { parseAsNumber, safelyParse } from './parsers';

export async function getGiftCardBalance(accessToken: string, emailAddress: string): Promise<number | null> {
    try {
        const response = await axios.post('/api/achievements/getGiftCardBalance', {
            token: accessToken,
            emailAddress,
        });

        if (response) {
            return safelyParse(response, 'data.balance', parseAsNumber, null);
        }

        return null;
    } catch (error) {
        console.log('Error: ', error);
    }

    return null;
}
