import { NextApiRequest, NextApiResponse } from 'next';

import { parseAsNumber, safelyParse } from '../../../utils/parsers';
import { apiErrorHandler } from '../../../middleware/errors';

async function approveOrder(req: NextApiRequest, res: NextApiResponse): Promise<void> {
    if (req.method === 'POST') {
        try {
            console.log(req.body);

            res.status(200);
        } catch (error) {
            const status = safelyParse(error, 'response.status', parseAsNumber, 500);

            res.status(status).json(apiErrorHandler(error, 'Failed to send order confirmation email.'));
        }
    }
}

export default approveOrder;
