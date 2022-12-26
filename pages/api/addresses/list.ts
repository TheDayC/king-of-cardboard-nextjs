import { NextApiRequest, NextApiResponse } from 'next';

import { connectToDatabase } from '../../../middleware/database';
import { errorHandler } from '../../../middleware/errors';
import { parseAsNumber, safelyParse } from '../../../utils/parsers';

const defaultErr = 'Address could not be found.';

async function listAddresses(req: NextApiRequest, res: NextApiResponse): Promise<void> {
    if (req.method === 'POST') {
        try {
            const { db } = await connectToDatabase();

            const collection = db.collection('addresses');
            const limit = safelyParse(req, 'body.count', parseAsNumber, 10);
            const skip = safelyParse(req, 'body.page', parseAsNumber, 0);

            const count = await collection.countDocuments();
            const addresses = await collection.find({}, { skip, limit }).toArray();

            res.status(200).json({ addresses, count });
        } catch (err: unknown) {
            const status = safelyParse(err, 'response.status', parseAsNumber, 500);

            res.status(status).json(errorHandler(err, defaultErr));
        }

        return Promise.resolve();
    }
}

export default listAddresses;
