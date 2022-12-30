import { NextApiRequest, NextApiResponse } from 'next';

import { connectToDatabase } from '../../../middleware/database';
import { errorHandler } from '../../../middleware/errors';
import { parseAsNumber, parseAsString, safelyParse } from '../../../utils/parsers';

const defaultErr = 'Could not find achievements for this user.';

async function listAchievements(req: NextApiRequest, res: NextApiResponse): Promise<void> {
    if (req.method === 'GET') {
        try {
            const { db } = await connectToDatabase();

            const collection = db.collection('achievements');
            const userId = safelyParse(req, 'query.userId', parseAsString, null);

            if (!userId) {
                res.status(400).json({ message: 'Must provide a valid user id.' });
                return Promise.resolve();
            }

            const achievementList = await collection.findOne({ userId }, { skip: 0, limit: 0 });

            if (!achievementList) {
                res.status(404).json({ message: defaultErr });
                return Promise.resolve();
            }

            res.status(200).json({ achievements: achievementList.achievements });
        } catch (err: unknown) {
            const status = safelyParse(err, 'response.status', parseAsNumber, 500);

            res.status(status).json(errorHandler(err, defaultErr));
        }

        return Promise.resolve();
    }
}

export default listAchievements;
