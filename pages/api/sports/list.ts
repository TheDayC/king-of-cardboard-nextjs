import { NextApiRequest, NextApiResponse } from 'next';

import { connectToDatabase } from '../../../middleware/database';
import { errorHandler } from '../../../middleware/errors';
import { parseAsNumber, safelyParse } from '../../../utils/parsers';

const defaultErr = 'Could not find any sports.';

async function listSports(req: NextApiRequest, res: NextApiResponse): Promise<void> {
    if (req.method === 'GET') {
        try {
            const { db } = await connectToDatabase();

            const sportsCollection = db.collection('sports');
            const count = safelyParse(req, 'body.count', parseAsNumber, 10);
            const page = safelyParse(req, 'body.page', parseAsNumber, 0);

            const sportCount = await sportsCollection.countDocuments();
            const sportList = await sportsCollection.find().skip(page).limit(count).toArray();

            if (sportList.length === 0) {
                res.status(400).json({ message: defaultErr });
                return;
            }

            res.status(200).json({ sports: sportList, count: sportCount });
        } catch (err: unknown) {
            const status = safelyParse(err, 'response.status', parseAsNumber, 500);

            res.status(status).json(errorHandler(err, defaultErr));
        }

        return Promise.resolve();
    }
}

export default listSports;
