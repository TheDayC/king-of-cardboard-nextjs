import { NextApiRequest, NextApiResponse } from 'next';

import { connectToDatabase } from '../../../middleware/database';
import { errorHandler } from '../../../middleware/errors';
import { parseAsBoolean, parseAsNumber, parseAsString, safelyParse } from '../../../utils/parsers';

const defaultErr = 'Options could not be updated.';

async function updateOptions(req: NextApiRequest, res: NextApiResponse): Promise<void> {
    if (req.method === 'POST') {
        try {
            const { db } = await connectToDatabase();
            const collection = db.collection('options');
            const isOnHoliday = safelyParse(req, 'body.options.isOnHoliday', parseAsBoolean, false);
            const errorMessage = safelyParse(req, 'body.options.errorMessage', parseAsString, '');

            await collection.findOneAndUpdate({}, { $set: { isOnHoliday, errorMessage } }, { upsert: true });

            res.status(201).end();
        } catch (err: unknown) {
            const status = safelyParse(err, 'response.status', parseAsNumber, 500);

            res.status(status).json(errorHandler(err, defaultErr));
        }

        return Promise.resolve();
    }
}

export default updateOptions;
