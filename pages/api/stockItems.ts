import { get, join } from 'lodash';
import { NextApiRequest, NextApiResponse } from 'next';

import { authClient } from '../../utils/auth';

async function stockItems(req: NextApiRequest, res: NextApiResponse): Promise<void> {
    if (req.method === 'POST') {
        const token = get(req, 'body.token', null);
        const sku_codes = join(get(req, 'body.sku_codes', []), ',');

        const cl = authClient(token);

        return cl
            .get(
                `/api/stock_items?filter[q][code_in]=${sku_codes}&include=prices&fields[stock_items]=code,description,image_url,name`
            )
            .then((response) => {
                const status = get(response, 'status', 500);
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                const { data: stockItems } = get(response, 'data', null);

                res.status(status).json({ stockItems });
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

export default stockItems;
