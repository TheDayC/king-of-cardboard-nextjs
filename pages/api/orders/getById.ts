import { ObjectId } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';

import { connectToDatabase } from '../../../middleware/database';
import { errorHandler } from '../../../middleware/errors';
import { parseAsNumber, parseAsString, safelyParse } from '../../../utils/parsers';

const defaultErr = 'Could not find order.';

async function getOrderById(req: NextApiRequest, res: NextApiResponse): Promise<void> {
    if (req.method === 'GET') {
        try {
            const { db } = await connectToDatabase();
            const collection = db.collection('orders');
            const id = safelyParse(req, 'query.id', parseAsString, null);

            if (!id) {
                res.status(400).json({ message: 'Id is invalid.' });
                return Promise.resolve();
            }

            const existingOrder = await collection.findOne({ _id: new ObjectId(id) });

            if (!existingOrder) {
                res.status(404).json({ message: defaultErr });
                return Promise.resolve();
            }

            res.status(200).json(existingOrder);
        } catch (err: unknown) {
            const status = safelyParse(err, 'response.status', parseAsNumber, 500);

            res.status(status).json(errorHandler(err, defaultErr));
        }

        return Promise.resolve();
    }
}

export default getOrderById;
