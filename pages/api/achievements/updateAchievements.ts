import { NextApiRequest, NextApiResponse } from 'next';

import { connectToDatabase } from '../../../middleware/database';
import {
    parseAsArrayOfAchievements,
    parseAsArrayOfStrings,
    parseAsNumber,
    parseAsString,
    safelyParse,
} from '../../../utils/parsers';

async function updateAchievements(req: NextApiRequest, res: NextApiResponse): Promise<void> {
    if (req.method === 'POST') {
        const { db, client } = await connectToDatabase();

        try {
            const emailAddress = safelyParse(req, 'body.emailAddress', parseAsString, null);
            const achievements = safelyParse(req, 'body.achievements', parseAsArrayOfAchievements, null);

            const achievementsCollection = db.collection('achievements');
            const hasUpdated = await achievementsCollection.updateOne({ emailAddress }, { $set: { achievements } });

            res.status(hasUpdated ? 200 : 400).json({ hasUpdated });
        } catch (err: unknown) {
            const status = safelyParse(err, 'response.status', parseAsNumber, 500);
            const statusText = safelyParse(err, 'response.statusText', parseAsString, '');
            const message = safelyParse(err, 'response.data.errors', parseAsArrayOfStrings, [
                'Something went very wrong! Likely a problem connecting to commercelayer.',
            ]);

            res.status(status).json({ status, statusText, message });
        }

        return Promise.resolve();
    }
}

export default updateAchievements;
