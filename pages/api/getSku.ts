import { get } from 'lodash';
import { NextApiRequest, NextApiResponse } from 'next';

import { authClient } from '../../utils/auth';

async function getSku(req: NextApiRequest, res: NextApiResponse): Promise<void> {
    if (req.method === 'POST') {
        const token = get(req, 'body.token', null);
        const id = get(req, 'body.id', '');

        const cl = authClient(token);

        return cl
            .get(`/api/skus/${id}?include=prices,sku_options`)
            .then((response) => {
                const status = get(response, 'status', 500);
                const { data: skuItem, included } = get(response, 'data', null);

                res.status(status).json({ skuItem, included });
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

export default getSku;
