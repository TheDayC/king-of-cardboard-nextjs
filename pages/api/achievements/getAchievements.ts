import { NextApiRequest, NextApiResponse } from 'next';

import { connectToDatabase } from '../../../middleware/database';
import {
    parseAsArrayOfAchievements,
    parseAsArrayOfStrings,
    parseAsNumber,
    parseAsString,
    safelyParse,
} from '../../../utils/parsers';

async function getAchievements(req: NextApiRequest, res: NextApiResponse): Promise<void> {
    if (req.method === 'POST') {
        const { db, client } = await connectToDatabase();

        try {
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
                res.status(404).json({ achievements: [] });
            }
        } catch (err) {
            const status = safelyParse(err, 'response.status', parseAsNumber, 500);
            const statusText = safelyParse(err, 'response.statusText', parseAsString, '');
            const message = safelyParse(err, 'response.data.errors', parseAsArrayOfStrings, [
                'Something went very wrong! Likely a problem connecting to commercelayer.',
            ]);

            res.status(status).json({ status, statusText, message });
        } finally {
            await client.close();
        }

        return Promise.resolve();
    }
}

export default getAchievements;
