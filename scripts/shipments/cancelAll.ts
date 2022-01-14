import path from 'path';
import * as dotenv from 'dotenv';
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

import { authClient } from '../../utils/auth';
import { parseAsArrayOfCommerceResponse, safelyParse } from '../../utils/parsers';
import { createToken } from '../token';
import { errorHandler } from '../../middleware/errors';

async function cancelAllShipments(): Promise<boolean> {
    try {
        const token = await createToken();
        const cl = authClient(token);
        const orderIdsRes = await cl.get(
            '/api/shipments/?fields[shipments]=id&filter[q][status_eq]=picking&page[size]=25&page[number]=1'
        );
        const shipments = safelyParse(orderIdsRes, 'data.data', parseAsArrayOfCommerceResponse, []);

        for (const shipment of shipments) {
            const res = await cl.patch(`/api/shipments/${shipment.id}`, {
                data: {
                    type: 'shipments',
                    id: shipment.id,
                    attributes: {
                        _on_hold: 'true',
                    },
                },
            });
            console.log('🚀 ~ file: cancelAll.ts ~ line 27 ~ cancelAllShipments ~ res', res.status);
        }

        return true;
    } catch (err: unknown) {
        errorHandler(err, 'An error occurred.');
    }

    return false;
}

cancelAllShipments();
