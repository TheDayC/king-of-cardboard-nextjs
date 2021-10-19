import { get } from 'lodash';
import { NextApiRequest, NextApiResponse } from 'next';

import { authClient } from '../../utils/auth';

async function getShipment(req: NextApiRequest, res: NextApiResponse): Promise<void> {
    if (req.method === 'POST') {
        const token = get(req, 'body.token', null);
        const shipmentId = get(req, 'body.shipmentId', null);
        const cl = authClient(token);
        const include = 'shipping_method,delivery_lead_time,shipment_line_items';

        return cl
            .get(`/api/shipments/${shipmentId}?include=${include}`)
            .then((response) => {
                const status = get(response, 'status', 500);
                const { data: shipment, included } = get(response, 'data', null);

                res.status(status).json({ shipment, included });
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

export default getShipment;
