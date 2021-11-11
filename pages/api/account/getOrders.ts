import { get } from 'lodash';
import { NextApiRequest, NextApiResponse } from 'next';

import { parseAsNumber, parseAsString, safelyParse } from '../../../utils/parsers';
import { authClient } from '../../../utils/auth';

async function getOrders(req: NextApiRequest, res: NextApiResponse): Promise<void> {
    if (req.method === 'POST') {
        const token = safelyParse(req, 'body.token', parseAsString, null);
        const emailAddress = safelyParse(req, 'body.emailAddress', parseAsString, null);
        const pageSize = safelyParse(req, 'body.pageSize', parseAsString, '5');
        const page = safelyParse(req, 'body.page', parseAsString, '0');

        const cl = authClient(token);

        return cl
            .get(`api/orders?filter[q][email_eq]=${emailAddress}&page[size]=${pageSize}&page[number]=${page}`)
            .then((response) => {
                const status = safelyParse(response, 'status', parseAsNumber, 500);
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                const orders = get(response, 'data.data', null);
                console.log('🚀 ~ file: getOrders.ts ~ line 23 ~ .then ~ orders', orders);

                res.status(status).json({ orders });
            })
            .catch((error) => {
                const status = safelyParse(error, 'response.status', parseAsNumber, 500);
                const statusText = safelyParse(error, 'response.statusText', parseAsString, 'Error');
                const message = error.response.data.errors
                    ? get(error.response.data.errors[0], 'detail', 'Error')
                    : 'Something went very wrong! Likely a problem connecting to commercelayer.';

                res.status(status).json({ status, statusText, message });
            });
    }
}

export default getOrders;
