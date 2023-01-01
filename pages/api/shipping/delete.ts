import { ObjectId } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';

import { connectToDatabase } from '../../../middleware/database';
import { errorHandler } from '../../../middleware/errors';
import { parseAsNumber, parseAsString, safelyParse } from '../../../utils/parsers';

const defaultErr = 'Shipping method could not be deleted.';

async function deleteShipping(req: NextApiRequest, res: NextApiResponse): Promise<void> {
    if (req.method === 'DELETE') {
        try {
            const { db } = await connectToDatabase();
            const collection = db.collection('shipping');
            const id = safelyParse(req, 'body.id', parseAsString, '');

            if (!id) {
                res.status(400).json({ message: 'Must supply an id.' });
                return;
            }

            const existing = await collection.findOne({ _id: new ObjectId(id) });

            if (!existing) {
                res.status(400).json({ message: 'Shipping method does not exist.' });
                return;
            }

            await collection.deleteOne({ _id: new ObjectId(id) });

            res.status(204).end();
        } catch (err: unknown) {
            const status = safelyParse(err, 'response.status', parseAsNumber, 500);

            res.status(status).json(errorHandler(err, defaultErr));
        }

        return Promise.resolve();
    }
}

export default deleteShipping;
