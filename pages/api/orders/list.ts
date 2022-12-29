import { toNumber } from 'lodash';
import { NextApiRequest, NextApiResponse } from 'next';

import { connectToDatabase } from '../../../middleware/database';
import { errorHandler } from '../../../middleware/errors';
import { parseAsNumber, parseAsString, safelyParse } from '../../../utils/parsers';

const defaultErr = 'Could not find any orders.';

async function listOrders(req: NextApiRequest, res: NextApiResponse): Promise<void> {
    if (req.method === 'GET') {
        try {
            const { db } = await connectToDatabase();

            const collection = db.collection('orders');
            const userId = safelyParse(req, 'query.userId', parseAsString, null);
            console.log('🚀 ~ file: list.ts:17 ~ listOrders ~ userId', userId);
            const count = toNumber(safelyParse(req, 'query.count', parseAsString, '10'));
            const page = toNumber(safelyParse(req, 'query.page', parseAsString, '0'));

            if (!userId) {
                res.status(400).json({ message: defaultErr });
                return;
            }

            const orderCount = await collection.countDocuments();
            const orderList = await collection.find({ userId }, { skip: page, limit: count }).toArray();

            if (orderList.length === 0) {
                res.status(404).json({ message: defaultErr });
                return;
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
