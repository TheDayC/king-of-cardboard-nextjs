import axios from 'axios';

import { errorHandler } from '../../middleware/errors';
import { Options } from '../../types/account';
import { parseAsNumber, safelyParse } from '../parsers';

const URL = process.env.NEXT_PUBLIC_SITE_URL || '';

export async function updateOptions(options: Options, isServer: boolean = false): Promise<boolean> {
    try {
        const headers = isServer ? { 'Accept-Encoding': 'application/json' } : undefined;
        const res = await axios.post(`${URL}/api/options/update`, { options }, { headers });
        const status = safelyParse(res, 'status', parseAsNumber, 400);

        return status === 201;
    } catch (error: unknown) {
        errorHandler(error, 'Could not get options.');
    }

    return false;
}

export async function getOptions(isServer: boolean = false): Promise<Options> {
    try {
        const headers = isServer ? { 'Accept-Encoding': 'application/json' } : undefined;
        const res = await axios.get(`${URL}/api/options/get`, {
            params: {},
            headers,
        });

        return res.data.options;
    } catch (error: unknown) {
        errorHandler(error, 'Could not get options.');
    }

    return {
        isOnHoliday: false,
        errorMessage: '',
    };
}
