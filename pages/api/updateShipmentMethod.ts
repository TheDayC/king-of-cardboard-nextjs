import { get } from 'lodash';
import { NextApiRequest, NextApiResponse } from 'next';

import { authClient } from '../../utils/auth';

async function updateShipmentMethod(req: NextApiRequest, res: NextApiResponse): Promise<void> {
    if (req.method === 'POST') {
        const token = get(req, 'body.token', null);
        const shipmentId = get(req, 'body.shipmentId', null);
        console.log('🚀 ~ file: updateShipmentMethod.ts ~ line 10 ~ updateShipmentMethod ~ shipmentId', shipmentId);
        const methodId = get(req, 'body.methodId', null);
        console.log('🚀 ~ file: updateShipmentMethod.ts ~ line 12 ~ updateShipmentMethod ~ methodId', methodId);
        const cl = authClient(token);

        cl.patch(`/api/shipments/${shipmentId}`, {
            data: {
                type: 'shipments',
                id: shipmentId,
                relationships: {
                    shipping_method: {
                        data: {
                            type: 'shipping_methods',
                            id: methodId,
                        },
                    },
                },
            },
        })
            .then((response) => {
                const status = get(response, 'status', 500);

                res.status(status).json({ hasUpdated: status === 200 ? true : false });
            })
            .catch((error) => {
                const status = get(error, 'response.status', 500);
                const statusText = get(error, 'response.statusText', 'Error');
                const message = error.response.data.errors
                    ? get(error.response.data.errors[0], 'detail', 'Error')
                    : 'Something went very wrong! Likely a problem connecting to commercelayer.';

                res.status(status).json({ status, statusText, message });
            });
    }
}

export default updateShipmentMethod;
