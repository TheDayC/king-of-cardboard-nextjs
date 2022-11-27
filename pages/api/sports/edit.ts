import { DateTime } from 'luxon';
import { ObjectId } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';

import { connectToDatabase } from '../../../middleware/database';
import { errorHandler } from '../../../middleware/errors';
import { parseAsArrayOfStrings, parseAsNumber, parseAsString, safelyParse } from '../../../utils/parsers';

const defaultErr = 'Sport could not be updated.';

async function editSport(req: NextApiRequest, res: NextApiResponse): Promise<void> {
    if (req.method === 'PUT') {
        try {
            const { db } = await connectToDatabase();
            const sportsCollection = db.collection('sports');

            const id = new ObjectId(safelyParse(req, 'body.id', parseAsString, ''));
            const existingSport = await sportsCollection.findOne({ _id: id });
            const currentDate = DateTime.now().setZone('Europe/London');

            if (!existingSport) {
                res.status(400).json({ message: 'Sport does not exist.' });
                return;
            }

            await sportsCollection.updateOne(
                { _id: id },
                {
                    $set: {
                        title: safelyParse(req, 'body.title', parseAsString, existingSport.title),
                        lastUpdated: currentDate.toISO(),
                        image: safelyParse(req, 'body.image', parseAsString, existingSport.image),
                        leagues: safelyParse(req, 'body.leagues', parseAsArrayOfStrings, existingSport.leagues),
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

export default editSport;
