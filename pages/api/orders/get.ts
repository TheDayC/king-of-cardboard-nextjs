import { toNumber } from 'lodash';
import { NextApiRequest, NextApiResponse } from 'next';

import { connectToDatabase } from '../../../middleware/database';
import { errorHandler } from '../../../middleware/errors';
import { parseAsNumber, parseAsString, safelyParse } from '../../../utils/parsers';

const defaultErr = 'Could not find order.';

async function getOrder(req: NextApiRequest, res: NextApiResponse): Promise<void> {
    if (req.method === 'GET') {
        try {
            const { db } = await connectToDatabase();
            const collection = db.collection('orders');

            const orderNumber = safelyParse(req, 'query.orderNumber', parseAsString, null);
            const userId = safelyParse(req, 'query.userId', parseAsString, null);

            if (!orderNumber || !userId) {
                res.status(400).json({ message: 'Order number or user id is invalid.' });
                return;
            }

            const existingOrder = await collection.findOne({ orderNumber: toNumber(orderNumber), userId });

            if (!existingOrder) {
                res.status(404).json({ message: defaultErr });
                return;
            }

            res.status(200).json(existingOrder);
        } catch (err: unknown) {
            const status = safelyParse(err, 'response.status', parseAsNumber, 500);

            res.status(status).json(errorHandler(err, defaultErr));
        }

        return Promise.resolve();
    }
}

export default getOrder;
