import { ObjectId } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';

import { connectToDatabase } from '../../../middleware/database';
import { errorHandler } from '../../../middleware/errors';
import { parseAsNumber, parseAsString, safelyParse } from '../../../utils/parsers';

const defaultErr = 'Address could not be found.';

async function getAddress(req: NextApiRequest, res: NextApiResponse): Promise<void> {
    if (req.method === 'GET') {
        try {
            const { db } = await connectToDatabase();
            const collection = db.collection('addresses');
            const id = safelyParse(req, 'query.id', parseAsString, '');
            const existing = await collection.findOne({ _id: new ObjectId(id) });

            if (!existing) {
                res.status(400).json({ message: 'Address does not exist.' });
                return;
            }

            res.status(200).json(existing);
        } catch (err: unknown) {
            const status = safelyParse(err, 'response.status', parseAsNumber, 500);

            res.status(status).json(errorHandler(err, defaultErr));
        }

        return Promise.resolve();
    }
}

export default getAddress;
