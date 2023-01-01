import { NextApiRequest, NextApiResponse } from 'next';

import { connectToDatabase } from '../../../middleware/database';
import { errorHandler } from '../../../middleware/errors';
import { parseAsNumber, safelyParse } from '../../../utils/parsers';

const defaultErr = 'Could not find any shipping methods.';

async function listShipping(req: NextApiRequest, res: NextApiResponse): Promise<void> {
    if (req.method === 'GET') {
        try {
            const { db } = await connectToDatabase();
            const collection = db.collection('shipping');
            const count = safelyParse(req, 'query.count', parseAsNumber, 10);
            const page = safelyParse(req, 'query.page', parseAsNumber, 0);

            const shippingCount = await collection.countDocuments();
            const shippingList = await collection.find({}, { skip: page, limit: count }).toArray();

            if (shippingList.length === 0) {
                res.status(400).json({ message: defaultErr });
                return;
            }

            res.status(200).json({ shippingMethods: shippingList, count: shippingCount });
        } catch (err: unknown) {
            const status = safelyParse(err, 'response.status', parseAsNumber, 500);

            res.status(status).json(errorHandler(err, defaultErr));
        }

        return Promise.resolve();
    }
}

export default listShipping;
