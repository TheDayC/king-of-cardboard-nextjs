import { get, join } from 'lodash';
import { NextApiRequest, NextApiResponse } from 'next';

import { authClient } from '../../utils/auth';

async function getOrder(req: NextApiRequest, res: NextApiResponse): Promise<void> {
    if (req.method === 'POST' && process.env.ECOM_CLIENT_ID) {
        const token = get(req, 'body.token', null);
        const orderId = get(req, 'body.orderId', null);
        const include = get(req, 'body.include', null);
        const cl = authClient(token);

        const apiUrl = include
            ? `/api/orders/${orderId}?include=${join(
                  include,
                  ','
              )}&fields[line_items]=item_type,image_url,name,sku_code,formatted_unit_amount,quantity,formatted_total_amount&fields[payment_methods]=name,payment_source_type`
            : `/api/orders/${orderId}`;

        cl.get(apiUrl)
            .then((response) => {
                const status = get(response, 'status', 500);
                const { data: order, included } = get(response, 'data', null);

                res.status(status).json({ order, included });
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

export default getOrder;
