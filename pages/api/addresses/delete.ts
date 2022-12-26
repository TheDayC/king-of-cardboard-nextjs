import { ObjectId } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';

import { connectToDatabase } from '../../../middleware/database';
import { errorHandler } from '../../../middleware/errors';
import { parseAsNumber, parseAsString, safelyParse } from '../../../utils/parsers';

const defaultErr = 'Address could not be updated.';

async function deleteAddress(req: NextApiRequest, res: NextApiResponse): Promise<void> {
    if (req.method === 'DELETE') {
        try {
            const { db } = await connectToDatabase();

            const collection = db.collection('addresses');
            const id = safelyParse(req, 'body.id', parseAsString, null);

            if (!id) {
                res.status(400).json({ message: 'Must supply an address id.' });
                return;
            }

            const objectId = new ObjectId(id);
            const existing = await collection.findOne({ _id: objectId });

            if (!existing) {
                res.status(404).json({ message: 'Address does not exist.' });
                return;
            }

            await collection.deleteOne({ _id: objectId });

            res.status(204).end();
        } catch (err: unknown) {
            const status = safelyParse(err, 'response.status', parseAsNumber, 500);

            res.status(status).json(errorHandler(err, defaultErr));
        }

        return Promise.resolve();
    }
}

export default deleteAddress;
