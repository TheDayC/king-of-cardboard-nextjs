import { NextApiRequest, NextApiResponse } from 'next';

import { connectToDatabase } from '../../../middleware/database';
import { errorHandler } from '../../../middleware/errors';
import { parseAsNumber, safelyParse } from '../../../utils/parsers';

const defaultErr = 'Could not find objectives.';

async function listObjectives(req: NextApiRequest, res: NextApiResponse): Promise<void> {
    if (req.method === 'GET') {
        try {
            const { db } = await connectToDatabase();

            const collection = db.collection('objectives');

            const objectives = await collection.find({}, { skip: 0, limit: 0 }).toArray();

            if (objectives.length === 0) {
                res.status(404).json({ message: defaultErr });
                return Promise.resolve();
            }

            res.status(200).json({ objectives });
        } catch (err: unknown) {
            const status = safelyParse(err, 'response.status', parseAsNumber, 500);

            res.status(status).json(errorHandler(err, defaultErr));
        }

        return Promise.resolve();
    }
}

export default listObjectives;
