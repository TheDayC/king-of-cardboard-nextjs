import { NextApiRequest, NextApiResponse } from 'next';
import Cors from 'cors';

import { parseAsNumber, safelyParse } from '../../../utils/parsers';
import { apiErrorHandler } from '../../../middleware/errors';
import { runMiddleware } from '../../../middleware/api';

// Initializing the cors middleware
const cors = Cors({
    origin: ['https://king-of-cardboard.commercelayer.io/'],
    methods: ['POST', 'HEAD'],
});

async function approveOrder(req: NextApiRequest, res: NextApiResponse): Promise<void> {
    if (req.method === 'POST') {
        // Run the middleware
        await runMiddleware(req, res, cors);

        try {
            console.log('MEMES');

            res.status(200).end();
        } catch (error) {
            console.log('🚀 ~ file: approveOrder.ts ~ line 25 ~ approveOrder ~ error', error);
            const status = safelyParse(error, 'response.status', parseAsNumber, 500);

            res.status(status).json(apiErrorHandler(error, 'Failed to send order confirmation email.'));
        }
    }
}

export default approveOrder;
