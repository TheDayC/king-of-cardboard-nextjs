import path from 'path';
import * as dotenv from 'dotenv';
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

import { authClient } from '../../utils/auth';
import { parseAsArrayOfCommerceResponse, parseAsString, safelyParse } from '../../utils/parsers';
import { createToken } from '../token';
import { errorHandler } from '../../middleware/errors';

async function deleteAllOrders(): Promise<boolean> {
    try {
        const token = await createToken();
        const cl = authClient(token);
        const orderIdsRes = await cl.get(
            '/api/orders/?fields[orders]=id,line_items&include=line_items&page[size]=25&page[number]=1&filter[q][status_eq]=pending'
        );
        const orders = safelyParse(orderIdsRes, 'data.data', parseAsArrayOfCommerceResponse, []);

        for (const order of orders) {
            const lineItemIds = order.relationships.line_items
                .map((item: unknown) => safelyParse(item, 'id', parseAsString, null))
                .filter((item: string | null) => item !== null);
            console.log('🚀 ~ file: deleteAll.ts ~ line 20 ~ deleteAllOrders ~ lineItemIds', lineItemIds);
            const baseData = {
                type: 'orders',
                id: order.id,
                attributes: {},
            };

            /* await cl.patch(`/api/orders/${order.id}`, {
                data: {
                    ...baseData,
                    attributes: { _refund: true },
                },
            });*/
            /* const res = await cl.patch(`/api/orders/${order.id}`, {
                data: {
                    ...baseData,
                    attributes: { _cancel: true },
                },
            });  */
            /* await cl.patch(`/api/orders/${order.id}`, {
                data: {
                    ...baseData,
                    attributes: { _archive: true },
                },
            }); */
            //const res = await cl.delete(`/api/orders/${order.id}`);
            //console.log("🚀 ~ file: deleteAll.ts ~ line 19 ~ deleteAllPrices ~ res", res.status)
        }

        return true;
    } catch (err: unknown) {
        errorHandler(err, 'An error occurred.');
    }

    return false;
}

deleteAllOrders();
