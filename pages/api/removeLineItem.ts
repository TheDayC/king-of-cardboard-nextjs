import { get } from 'lodash';
import { NextApiRequest, NextApiResponse } from 'next';

import { authClient } from '../../utils/auth';

async function removeLineItem(req: NextApiRequest, res: NextApiResponse): Promise<void> {
    if (req.method === 'POST') {
        const token = get(req, 'body.token', null);
        const id = get(req, 'body.id', null);
        const cl = authClient(token);

        cl.delete(`/api/line_items/${id}`)
            .then((response) => {
                const status = get(response, 'status', 500);

                res.status(200).json({ deleted: status === 204 ? true : false });
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

export default removeLineItem;
