import { NextApiRequest, NextApiResponse } from 'next';

import { connectToDatabase } from '../../../middleware/database';
import { parseAsArrayOfStrings, parseAsNumber, parseAsString, safelyParse } from '../../../utils/parsers';

async function getObjectives(req: NextApiRequest, res: NextApiResponse): Promise<void> {
    if (req.method === 'POST') {
        const { db, client } = await connectToDatabase();

        try {
            const categories = safelyParse(req, 'body.categories', parseAsArrayOfStrings, null);
            const types = safelyParse(req, 'body.types', parseAsArrayOfStrings, null);
            const page = safelyParse(req, 'body.page', parseAsNumber, 0);
            const limit = 9;
            const skip = page * limit;

            const objectivesCollection = db.collection('objectives');

            // Define our query based on what is passed. Leave empty by default.
            let query = {};
            if (categories && types) {
                query = { $or: [{ category: { $in: categories } }, { types: { $in: types } }] };
            } else if (categories) {
                query = { category: { $in: categories } };
            } else if (types) {
                query = { types: { $in: types } };
            }

            const objectivesCount = await objectivesCollection.find(query).count();
            const objectivesDocument = await objectivesCollection.find(query).skip(skip).limit(limit).toArray();

            if (objectivesDocument) {
                res.status(200).json({ objectives: objectivesDocument, count: objectivesCount });
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
