import { NextApiRequest, NextApiResponse } from 'next';
import { isAxiosError } from 'axios';

import { authClient } from '../../utils/auth';
import { parseAsNumber, parseAsString, safelyParse } from '../../utils/parsers';
import { errorHandler } from '../../middleware/errors';

const defaultError = 'Could not get access token.';

async function getAccessToken(req: NextApiRequest, res: NextApiResponse): Promise<void> {
    if (req.method === 'GET' && process.env.ECOM_CLIENT_ID) {
        try {
            const cl = authClient();

            const response = await cl.post('/oauth/token', {
                grant_type: 'client_credentials',
                client_id: process.env.ECOM_CLIENT_ID,
                client_secret: process.env.ECOM_CLIENT_SECRET,
                scope: process.env.NEXT_PUBLIC_MARKET,
            });

            const token = safelyParse(response, 'data.access_token', parseAsString, null);
            const expires = safelyParse(response, 'data.expires_in', parseAsNumber, null);
            const status = safelyParse(response, 'status', parseAsNumber, 500);

            if (token && expires) {
                res.status(status).json({ token, expires });
            } else {
                const message = safelyParse(response, 'statusText', parseAsString, 'Internal Server Error');
                const description = safelyParse(response, 'message', parseAsString, defaultError);

                res.status(status).json({ status, message, description });
            }
        } catch (error) {
            if (isAxiosError(error)) {
                const status = safelyParse(error, 'response.status', parseAsNumber, 500);

                res.status(status).json(errorHandler(error, defaultError));
            }
        }
    } else {
        res.status(405).end('Method Not Allowed');
    }
}

export default getAccessToken;
