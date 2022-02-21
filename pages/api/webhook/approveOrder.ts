import { NextApiRequest, NextApiResponse } from 'next';
import Cors from 'cors';

import { parseAsNumber, safelyParse } from '../../../utils/parsers';
import { apiErrorHandler } from '../../../middleware/errors';
import { runMiddleware } from '../../../middleware/api';

// Initializing the cors middleware
const cors = Cors({
    origin: false,
    methods: ['POST', 'HEAD'],
});

async function approveOrder(req: NextApiRequest, res: NextApiResponse): Promise<void> {
    // Run the middleware
    await runMiddleware(req, res, cors);

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
