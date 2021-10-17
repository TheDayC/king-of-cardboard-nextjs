import { get } from 'lodash';
import { NextApiRequest, NextApiResponse } from 'next';

import { authClient } from '../../utils/auth';

async function confirmOrder(req: NextApiRequest, res: NextApiResponse): Promise<void> {
    if (req.method === 'POST') {
        const token = get(req, 'body.token', null);
        const id = get(req, 'body.id', null);
        const cl = authClient(token);

        cl.patch(`/api/orders/${id}`, {
            data: {
                type: 'orders',
                id,
                attributes: {
                    _place: true,
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

export default confirmOrder;