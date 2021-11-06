import { get, join } from 'lodash';
import { NextApiRequest, NextApiResponse } from 'next';

import { authClient } from '../../utils/auth';

async function getSkus(req: NextApiRequest, res: NextApiResponse): Promise<void> {
    if (req.method === 'POST') {
        const token = get(req, 'body.token', null);
        const sku_codes = join(get(req, 'body.sku_codes', []), ',');

        const cl = authClient(token);
        const fields =
            '&fields[skus]=code,image_url,name&fields[prices]=sku_code,formatted_amount,formatted_compare_at_amount';

        return cl
            .get(
                `/api/skus?filter[q][code_in]=${sku_codes}&filter[q][stock_items_quantity_gt]=0&include=prices${fields}`
            )
            .then((response) => {
                const status = get(response, 'status', 500);
                const { data: skuItems, included } = get(response, 'data', null);

                res.status(status).json({ skuItems, included });
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

export default getSkus;
