import { get } from 'lodash';
import { NextApiRequest, NextApiResponse } from 'next';

import { authClient } from '../../utils/auth';
import { parseAsString, safelyParse } from '../../utils/parsers';

async function refreshPaymentSource(req: NextApiRequest, res: NextApiResponse): Promise<void> {
    if (req.method === 'POST') {
        const token = safelyParse(req, 'body.token', parseAsString, null);
        const id = safelyParse(req, 'body.id', parseAsString, null);
        const paymentSourceType = safelyParse(req, 'body.paymentSourceType', parseAsString, 'stripe_payments');
        const cl = authClient(token);

        return cl
            .patch(`/api/${paymentSourceType}/${id}`, {
                data: {
                    type: paymentSourceType,
                    id,
                    attributes: {
                        _refresh: true,
                    },
                },
            })
            .then((response) => {
                const status = get(response, 'status', 500);

                res.status(status).json({ hasPlaced: status === 200 ? true : false });
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

export default refreshPaymentSource;
