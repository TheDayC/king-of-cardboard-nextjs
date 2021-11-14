import { NextApiRequest, NextApiResponse } from 'next';

import { authClient } from '../../utils/auth';
import { parseAsNumber, parseAsString, safelyParse } from '../../utils/parsers';

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
                const token = safelyParse(response, 'data.access_token', parseAsString, null);
                const expires = safelyParse(response, 'data.expires_in', parseAsNumber, null);
                const status = safelyParse(response, 'status', parseAsNumber, 500);

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
