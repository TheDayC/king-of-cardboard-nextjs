import { get, join } from 'lodash';
import { NextApiRequest, NextApiResponse } from 'next';

import { authClient } from '../../../utils/auth';
import { parseAsString, safelyParse } from '../../../utils/parsers';

async function findCustomer(req: NextApiRequest, res: NextApiResponse): Promise<void> {
    if (req.method === 'POST') {
        const token = safelyParse(req, 'body.token', parseAsString, null);
        const emailAddress = safelyParse(req, 'body.emailAddress', parseAsString, '');

        const cl = authClient(token);

        return cl
            .get(`/api/customers?filter[q][email_in]=${emailAddress}`)
            .then((response) => {
                const status = get(response, 'status', 500);
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                const customer = get(response, 'data.data', null);

                res.status(status).json({ customer });
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

export default findCustomer;
