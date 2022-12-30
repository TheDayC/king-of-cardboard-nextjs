import { NextApiRequest, NextApiResponse } from 'next';

import { connectToDatabase } from '../../../../middleware/database';
import { errorHandler } from '../../../../middleware/errors';
import { parseAsNumber, parseAsString, safelyParse } from '../../../../utils/parsers';

const defaultErr = 'Could not find any orders.';

async function listOrders(req: NextApiRequest, res: NextApiResponse): Promise<void> {
    if (req.method === 'POST') {
        try {
            const { db } = await connectToDatabase();

            const collection = db.collection('orders');
            const userId = safelyParse(req, 'body.userId', parseAsString, null);
            const count = safelyParse(req, 'body.count', parseAsNumber, 10);
            const page = safelyParse(req, 'body.page', parseAsNumber, 0);

            if (!userId) {
                res.status(400).json({ message: defaultErr });
                return Promise.resolve();
            }

            const orderCount = await collection.countDocuments();
            const orderList = await collection.find({ userId }, { skip: page, limit: count }).toArray();

            if (orderList.length === 0) {
                res.status(404).json({ message: defaultErr });
                return Promise.resolve();
            }

            res.status(200).json({ orders: orderList, count: orderCount });
        } catch (err: unknown) {
            const status = safelyParse(err, 'response.status', parseAsNumber, 500);

            res.status(status).json(errorHandler(err, defaultErr));
        }

        return Promise.resolve();
    }
}

export default listOrders;
