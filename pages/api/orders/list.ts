import { NextApiRequest, NextApiResponse } from 'next';

import { connectToDatabase } from '../../../middleware/database';
import { errorHandler } from '../../../middleware/errors';
import { parseAsNumber, safelyParse } from '../../../utils/parsers';

const defaultErr = 'Could not find any orders.';

async function listOrders(req: NextApiRequest, res: NextApiResponse): Promise<void> {
    if (req.method === 'GET') {
        try {
            const { db } = await connectToDatabase();

            const ordersCollection = db.collection('orders');
            const count = safelyParse(req, 'body.count', parseAsNumber, 10);
            const page = safelyParse(req, 'body.page', parseAsNumber, 0);

            const orderCount = await ordersCollection.countDocuments();
            const orderList = await ordersCollection.find().skip(page).limit(count).toArray();

            if (orderList.length === 0) {
                res.status(400).json({ message: defaultErr });
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
