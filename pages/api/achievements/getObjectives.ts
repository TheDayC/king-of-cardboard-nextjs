import { NextApiRequest, NextApiResponse } from 'next';

import { connectToDatabase } from '../../../middleware/database';
import { errorHandler } from '../../../middleware/errors';
import { parseAsArrayOfStrings, parseAsNumber, safelyParse } from '../../../utils/parsers';

const defaultErr = 'We could not fetch your objectives.';

function buildQuery(categories: string[] | null, types: string[] | null): object {
    if (categories && types) {
        return { $or: [{ category: { $in: categories } }, { types: { $in: types } }] };
    } else if (categories) {
        return { category: { $in: categories } };
    } else if (types) {
        return { types: { $in: types } };
    } else {
        return {};
    }
}

async function getObjectives(req: NextApiRequest, res: NextApiResponse): Promise<void> {
    if (req.method === 'POST') {
        const { db } = await connectToDatabase();

        try {
            const categories = safelyParse(req, 'body.categories', parseAsArrayOfStrings, null);
            const types = safelyParse(req, 'body.types', parseAsArrayOfStrings, null);
            const page = safelyParse(req, 'body.page', parseAsNumber, 0);
            const limit = 9;
            const skip = page * limit;

            const objectivesCollection = db.collection('objectives');

            // Define our query based on what is passed. Leave empty by default.
            const query = buildQuery(categories, types);

            const objectivesCount = await objectivesCollection.find(query).count();
            const objectivesDocument = await objectivesCollection.find(query).skip(skip).limit(limit).toArray();
            const status = objectivesDocument ? 200 : 400;
            const body = objectivesDocument
                ? { objectives: objectivesDocument, count: objectivesCount }
                : { status, message: 'Bad Request', description: defaultErr };

            res.status(status).json(body);
        } catch (err: unknown) {
            const status = safelyParse(err, 'response.status', parseAsNumber, 500);

            res.status(status).json(errorHandler(err, defaultErr));
        }

        return Promise.resolve();
    }
}

export default getObjectives;
