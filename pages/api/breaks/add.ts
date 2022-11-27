import { DateTime } from 'luxon';
import { NextApiRequest, NextApiResponse } from 'next';

import { Status, Format } from '../../../enums/breaks';
import { connectToDatabase } from '../../../middleware/database';
import { errorHandler } from '../../../middleware/errors';
import { parseAsNumber, parseAsString, safelyParse } from '../../../utils/parsers';

const defaultErr = 'Break could not be added.';

async function addBreak(req: NextApiRequest, res: NextApiResponse): Promise<void> {
    if (req.method === 'POST') {
        try {
            const { db } = await connectToDatabase();
            const breaksCollection = db.collection('breaks');
            const currentDate = DateTime.now().setZone('Europe/London');

            await breaksCollection.insertOne({
                title: safelyParse(req, 'body.title', parseAsString, null),
                createdBy: safelyParse(req, 'body.createdBy', parseAsString, null),
                status: Status.Draft,
                created: currentDate.toISO(),
                lastUpdated: currentDate.toISO(),
                format: safelyParse(req, 'body.format', parseAsNumber, Format.PickYourTeam),
                sport: safelyParse(req, 'body.sport', parseAsString, null),
                league: safelyParse(req, 'body.league', parseAsString, null),
                slots: req.body.slots || null,
            });

            res.status(201).end();
        } catch (err: unknown) {
            const status = safelyParse(err, 'response.status', parseAsNumber, 500);

            res.status(status).json(errorHandler(err, defaultErr));
        }

        return Promise.resolve();
    }
}

export default addBreak;
