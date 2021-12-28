import { NextApiRequest, NextApiResponse } from 'next';

import { connectToDatabase } from '../../../middleware/database';
import { errorHandler } from '../../../middleware/errors';
import { parseAsArrayOfAchievements, parseAsNumber, parseAsString, safelyParse } from '../../../utils/parsers';

const defaultErr = 'We could not fetch your achievements.';

async function getAchievements(req: NextApiRequest, res: NextApiResponse): Promise<void> {
    if (req.method === 'POST') {
        try {
            const { db } = await connectToDatabase();
            const emailAddress = safelyParse(req, 'body.emailAddress', parseAsString, null);

            const achievementsCollection = db.collection('achievements');
            const achievementsDocument = await achievementsCollection.findOne({ emailAddress });

            if (achievementsDocument) {
                const giftCardId = safelyParse(achievementsDocument, 'giftCardId', parseAsString, null);
                const achievements = safelyParse(
                    achievementsDocument,
                    'achievements',
                    parseAsArrayOfAchievements,
                    null
                );

                res.status(200).json({ giftCardId, achievements });
            } else {
                res.status(400).json({ status: 400, message: 'Bad Request', description: defaultErr });
            }
        } catch (err: unknown) {
            const status = safelyParse(err, 'response.status', parseAsNumber, 500);

            res.status(status).json(errorHandler(err, defaultErr));
        }

        return Promise.resolve();
    }
}

export default getAchievements;
