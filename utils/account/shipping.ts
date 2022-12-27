import axios from 'axios';

import { errorHandler } from '../../middleware/errors';
import { AccountShippingMethod, ListShippingMethods } from '../../types/shipping';
import { parseAsNumber, safelyParse } from '../parsers';

const URL = process.env.NEXT_PUBLIC_SITE_URL || '';

export async function addShippingMethod(options: any): Promise<boolean> {
    try {
        const res = await axios.post(`${URL}/api/shipping/add`, {
            ...options,
        });
        const status = safelyParse(res, 'status', parseAsNumber, 400);

        return status === 201;
    } catch (error: unknown) {
        errorHandler(error, 'Could not add shipping method.');
    }

    return false;
}

export async function editShippingMethod(id: string, options: any): Promise<boolean> {
    try {
        const res = await axios.put(`${URL}/api/shipping/edit`, {
            ...options,
            id,
        });
        const status = safelyParse(res, 'status', parseAsNumber, 500);

        return status === 204;
    } catch (error: unknown) {
        errorHandler(error, 'Could not edit shipping method.');
    }

    return false;
}

export async function listShippingMethods(count: number, page: number): Promise<ListShippingMethods> {
    try {
        const res = await axios.get(`${URL}/api/shipping/list`, {
            params: {
                count,
                page,
            },
        });

        return res.data;
    } catch (error: unknown) {
        errorHandler(error, 'Could not list shipping methods.');
    }

    return { shippingMethods: [], count: 0 };
}

export async function deleteShippingMethod(id: string): Promise<boolean> {
    try {
        const res = await axios.delete(`${URL}/api/shipping/delete`, {
            data: {
                id,
            },
        });
        const status = safelyParse(res, 'status', parseAsNumber, 500);

        return status === 204;
    } catch (error: unknown) {
        errorHandler(error, 'Could not delete shipping method.');
    }

    return false;
}

export async function getShippingMethod(id: string): Promise<AccountShippingMethod | null> {
    try {
        const res = await axios.get(`${URL}/api/shipping/get`, {
            params: {
                id,
            },
        });

        return res.data as AccountShippingMethod;
    } catch (error: unknown) {
        errorHandler(error, 'Could not get shipping method.');
    }

    return null;
}
