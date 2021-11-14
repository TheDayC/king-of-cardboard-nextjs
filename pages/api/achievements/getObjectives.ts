import { NextApiRequest, NextApiResponse } from 'next';

import { connectToDatabase } from '../../../middleware/database';
import { parseAsArrayOfStrings, parseAsNumber, parseAsString, safelyParse } from '../../../utils/parsers';

async function getObjectives(req: NextApiRequest, res: NextApiResponse): Promise<void> {
    if (req.method === 'POST') {
        try {
            const categories = safelyParse(req, 'body.categories', parseAsString, null);
            const types = safelyParse(req, 'body.types', parseAsString, null);

            const { db } = await connectToDatabase();
            const objectivesCollection = db.collection('objectives');
            const objectivesDocument = objectivesCollection.find({
                category: { $in: categories },
                types: { $in: types },
            });

            if (objectivesDocument) {
                console.log(
                    '🚀 ~ file: getObjectives.ts ~ line 17 ~ getObjectives ~ objectivesDocument',
                    objectivesDocument
                );

                res.status(200).json({ objectives: objectivesDocument });
            } else {
                res.status(404).json({ objectives: [] });
            }
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

export default getObjectives;
