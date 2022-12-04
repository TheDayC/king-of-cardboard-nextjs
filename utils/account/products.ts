import axios from 'axios';
import { errorHandler } from '../../middleware/errors';
import { ListProducts } from '../../types/productsNew';
import { parseAsNumber, safelyParse } from '../parsers';

const URL = process.env.NEXT_PUBLIC_SITE_URL || '';

export function convertCost(cost: number): string {
    return `£${cost / 10}`;
}

export async function listProducts(count: number, page: number): Promise<ListProducts> {
    try {
        const res = await axios.get(`${URL}/api/products/list`, {
            params: {
                count,
                page,
            },
        });

        return res.data;
    } catch (error: unknown) {
        errorHandler(error, 'Could not list products.');
    }

    return { products: [], count: 0 };
}

export async function deleteProduct(id: string): Promise<boolean> {
    try {
        const res = await axios.delete(`${URL}/api/products/delete`, {
            data: {
                id,
            },
        });
        const status = safelyParse(res, 'status', parseAsNumber, 500);

        return status === 204;
    } catch (error: unknown) {
        errorHandler(error, 'Could not delete product.');
    }

    return false;
}
