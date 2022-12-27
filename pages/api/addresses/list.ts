import { ObjectId } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';

import { connectToDatabase } from '../../../middleware/database';
import { errorHandler } from '../../../middleware/errors';
import { parseAsNumber, parseAsString, safelyParse } from '../../../utils/parsers';

const defaultErr = 'Address could not be found.';

async function listAddresses(req: NextApiRequest, res: NextApiResponse): Promise<void> {
    if (req.method === 'GET') {
        try {
            const { db } = await connectToDatabase();

            const collection = db.collection('addresses');
            const limit = safelyParse(req, 'query.limit', parseAsNumber, 10);
            const skip = safelyParse(req, 'query.skip', parseAsNumber, 0);
            const userId = safelyParse(req, 'query.userId', parseAsString, null);

            if (!userId) {
                res.status(400).json({ message: 'Must supply a user id.' });
                return;
            }

            const count = await collection.countDocuments();
            const addresses = await collection
                .find({ userId: new ObjectId(userId) }, { skip, limit })
                .project({ userId: 0, created: 0, lastUpdated: 0 })
                .toArray();

            res.status(200).json({ addresses, count });
        } catch (err: unknown) {
            const status = safelyParse(err, 'response.status', parseAsNumber, 500);

            res.status(status).json(errorHandler(err, defaultErr));
        }

        return Promise.resolve();
    }
}

export default listAddresses;
