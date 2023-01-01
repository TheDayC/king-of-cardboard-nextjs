import { DateTime } from 'luxon';
import { ObjectId } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';

import { connectToDatabase } from '../../../middleware/database';
import { errorHandler } from '../../../middleware/errors';
import { parseAsNumber, parseAsString, safelyParse } from '../../../utils/parsers';

const defaultErr = 'Break could not be updated.';

async function editBreak(req: NextApiRequest, res: NextApiResponse): Promise<void> {
    if (req.method === 'PUT') {
        try {
            const { db } = await connectToDatabase();
            const breaksCollection = db.collection('breaks');

            const id = new ObjectId(safelyParse(req, 'body.id', parseAsString, ''));
            const existingBreak = await breaksCollection.findOne({ _id: id });
            const currentDate = DateTime.now().setZone('Europe/London');

            if (!existingBreak) {
                res.status(400).json({ message: 'Break does not exist.' });
                return;
            }

            await breaksCollection.updateOne(
                { _id: id },
                {
                    $set: {
                        title: safelyParse(req, 'body.title', parseAsString, existingBreak.title),
                        status: safelyParse(req, 'body.format', parseAsNumber, existingBreak.status),
                        lastUpdated: new Date(currentDate.toISO()),
                        format: safelyParse(req, 'body.format', parseAsNumber, existingBreak.format),
                        sport: safelyParse(req, 'body.sport', parseAsString, existingBreak.sport),
                        league: safelyParse(req, 'body.league', parseAsString, existingBreak.league),
                        slots: req.body.slots || existingBreak.slots,
                    },
                }
            );

            res.status(204).end();
        } catch (err: unknown) {
            const status = safelyParse(err, 'response.status', parseAsNumber, 500);

            res.status(status).json(errorHandler(err, defaultErr));
        }

        return Promise.resolve();
    }
}

export default editBreak;
