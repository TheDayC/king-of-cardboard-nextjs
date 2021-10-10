import { get } from 'lodash';
import { NextApiRequest, NextApiResponse } from 'next';

import { authClient } from '../../utils/auth';

async function createPaymentSource(req: NextApiRequest, res: NextApiResponse): Promise<void> {
    if (req.method === 'POST') {
        const token = get(req, 'body.token', null);
        const id = get(req, 'body.id', null);
        const paymentSourceType = get(req, 'body.paymentSourceType', null);
        const cl = authClient(token);

        cl.post(`/api/${paymentSourceType}`, {
            data: {
                type: paymentSourceType,
                attributes: {},
                relationships: {
                    order: {
                        data: {
                            type: 'orders',
                            id,
                        },
                    },
                },
            },
        })
            .then((response) => {
                const status = get(response, 'status', 500);
                const clientSecret = get(response, 'data.data.attributes.client_secret', null);

                res.status(status).json({ clientSecret });
            })
            .catch((error) => {
                console.log('🚀 ~ file: createPaymentSource.ts ~ line 34 ~ createPaymentSource ~ error', error);
                const status = get(error, 'response.status', 500);
                const statusText = get(error, 'response.statusText', 'Error');
                const message = error.response.data.errors
                    ? get(error.response.data.errors[0], 'detail', 'Error')
                    : 'Something went very wrong! Likely a problem connecting to commercelayer.';

                res.status(status).json({ status, statusText, message });
            });
    }
}

export default createPaymentSource;
