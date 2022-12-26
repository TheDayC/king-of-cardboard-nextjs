import axios from 'axios';

import { errorHandler } from '../../middleware/errors';
import { parseAsNumber, safelyParse } from '../parsers';

const URL = process.env.NEXT_PUBLIC_SITE_URL || '';

export async function addAddress(options: any): Promise<boolean> {
    try {
        const res = await axios.post(`${URL}/api/addresses/add`, {
            ...options,
        });
        const status = safelyParse(res, 'status', parseAsNumber, 400);

        return status === 201;
    } catch (error: unknown) {
        errorHandler(error, 'Could not add product.');
    }

    return false;
}

export async function editAddress(options: any): Promise<boolean> {
    try {
        const res = await axios.post(`${URL}/api/addresses/edit`, {
            ...options,
        });
        const status = safelyParse(res, 'status', parseAsNumber, 400);

        return status === 201;
    } catch (error: unknown) {
        errorHandler(error, 'Could not add product.');
    }

    return false;
}
