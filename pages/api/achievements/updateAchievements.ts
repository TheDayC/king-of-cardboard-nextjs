import { NextApiRequest, NextApiResponse } from 'next';

import { connectToDatabase } from '../../../middleware/database';
import { errorHandler } from '../../../middleware/errors';
import { parseAsArrayOfAchievements, parseAsNumber, parseAsString, safelyParse } from '../../../utils/parsers';

const defaultErr = 'We could not update your achievements.';

async function updateAchievements(req: NextApiRequest, res: NextApiResponse): Promise<void> {
    if (req.method === 'POST') {
        const { db } = await connectToDatabase();

        try {
            const emailAddress = safelyParse(req, 'body.emailAddress', parseAsString, null);
            const achievements = safelyParse(req, 'body.achievements', parseAsArrayOfAchievements, null);

            const achievementsCollection = db.collection('achievements');
            const hasUpdated = await achievementsCollection.updateOne({ emailAddress }, { $set: { achievements } });
            const status = hasUpdated ? 200 : 400;
            const body = hasUpdated ? { hasUpdated } : { status, message: 'Bad Request', description: defaultErr };

            res.status(status).json(body);
        } catch (err: unknown) {
            const status = safelyParse(err, 'response.status', parseAsNumber, 500);

            res.status(status).json(errorHandler(err, defaultErr));
        }

        return Promise.resolve();
    }
}

export default updateAchievements;
