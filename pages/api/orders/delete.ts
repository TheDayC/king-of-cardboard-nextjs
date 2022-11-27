import { ObjectId } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';

import { connectToDatabase } from '../../../middleware/database';
import { errorHandler } from '../../../middleware/errors';
import { parseAsNumber, parseAsString, safelyParse } from '../../../utils/parsers';

const defaultErr = 'Order could not be deleted.';

async function deleteOrder(req: NextApiRequest, res: NextApiResponse): Promise<void> {
    if (req.method === 'DELETE') {
        try {
            const { db } = await connectToDatabase();
            const ordersCollection = db.collection('orders');

            const id = safelyParse(req, 'body.id', parseAsString, '');
            const existingOrder = await ordersCollection.findOne({ _id: new ObjectId(id) });

            if (!existingOrder) {
                res.status(400).json({ message: 'Order does not exist.' });
                return;
            }

            await ordersCollection.deleteOne({ _id: new ObjectId(id) });

            res.status(204).end();
        } catch (err: unknown) {
            const status = safelyParse(err, 'response.status', parseAsNumber, 500);

            res.status(status).json(errorHandler(err, defaultErr));
        }

        return Promise.resolve();
    }
}

export default deleteOrder;
