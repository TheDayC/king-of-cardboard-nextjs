import { toNumber } from 'lodash';
import { NextApiRequest, NextApiResponse } from 'next';

import { connectToDatabase } from '../../../../middleware/database';
import { errorHandler } from '../../../../middleware/errors';
import { parseAsNumber, parseAsString, safelyParse } from '../../../../utils/parsers';

const defaultErr = 'Could not find any orders.';

async function listAllOrders(req: NextApiRequest, res: NextApiResponse): Promise<void> {
    if (req.method === 'GET') {
        try {
            const { db } = await connectToDatabase();

            const collection = db.collection('orders');
            const limit = toNumber(safelyParse(req, 'query.limit', parseAsString, 10));
            const skip = toNumber(safelyParse(req, 'query.skip', parseAsString, 0));

            const orderCount = await collection.countDocuments();
            const orderList = await collection.find({}, { skip, limit }).toArray();

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

export default listAllOrders;
