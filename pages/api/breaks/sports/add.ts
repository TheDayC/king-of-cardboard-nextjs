import { DateTime } from 'luxon';
import { NextApiRequest, NextApiResponse } from 'next';

import { connectToDatabase } from '../../../../middleware/database';
import { errorHandler } from '../../../../middleware/errors';
import { parseAsArrayOfStrings, parseAsNumber, parseAsString, safelyParse } from '../../../../utils/parsers';

const defaultErr = 'Sport could not be added.';

async function addSport(req: NextApiRequest, res: NextApiResponse): Promise<void> {
    if (req.method === 'POST') {
        try {
            const { db } = await connectToDatabase();
            const sportsCollection = db.collection('sports');
            const currentDate = DateTime.now().setZone('Europe/London');

            await sportsCollection.insertOne({
                title: safelyParse(req, 'body.title', parseAsString, null),
                created: new Date(currentDate.toISO()),
                lastUpdated: new Date(currentDate.toISO()),
                image: safelyParse(req, 'body.image', parseAsString, null),
                leagues: safelyParse(req, 'body.leagues', parseAsArrayOfStrings, []),
            });

            res.status(201).end();
        } catch (err: unknown) {
            const status = safelyParse(err, 'response.status', parseAsNumber, 500);

            res.status(status).json(errorHandler(err, defaultErr));
        }

        return Promise.resolve();
    }
}

export default addSport;
