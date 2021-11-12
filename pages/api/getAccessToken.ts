import { get } from 'lodash';
import { NextApiRequest, NextApiResponse } from 'next';

import { authClient } from '../../utils/auth';

async function getAccessToken(req: NextApiRequest, res: NextApiResponse): Promise<void> {
    if (req.method === 'GET' && process.env.ECOM_CLIENT_ID) {
        const cl = authClient();

        return cl
            .post('/oauth/token', {
                grant_type: 'client_credentials',
                client_id: process.env.ECOM_CLIENT_ID,
                client_secret: process.env.ECOM_CLIENT_SECRET,
                scope: 'market:6098',
            })
            .then((response) => {
                const token = get(response, 'data.access_token', null);
                const expires = get(response, 'data.expires_in', null);
                const status = get(response, 'status', 500);

                if (token && expires) {
                    res.status(status).json({ token, expires });
                } else {
                    res.status(status).json({ error: 'Could not get access token.', status });
                }
            })
            .catch((error) => {
                res.status(500).json(error.response);
            });
    } else {
        res.status(405).end('Method Not Allowed');
    }
}

export default getAccessToken;
