import { DateTime } from 'luxon';
import { ObjectId } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';

import { connectToDatabase } from '../../../middleware/database';
import { errorHandler } from '../../../middleware/errors';
import { parseAsNumber, parseAsString, safelyParse } from '../../../utils/parsers';

const defaultErr = 'Address could not be updated.';

async function editAddress(req: NextApiRequest, res: NextApiResponse): Promise<void> {
    if (req.method === 'PUT') {
        try {
            const { db } = await connectToDatabase();

            const collection = db.collection('addresses');
            const id = safelyParse(req, 'body.id', parseAsString, null);

            if (!id) {
                res.status(400).json({ message: 'Must supply an address id.' });
                return;
            }

            const objectId = new ObjectId(id);
            const existing = await collection.findOne({ _id: objectId });
            const currentDate = DateTime.now().setZone('Europe/London');

            if (!existing) {
                res.status(404).json({ message: 'Address does not exist.' });
                return;
            }

            await collection.updateOne(
                { _id: new ObjectId(id) },
                {
                    $set: {
                        created: existing.created,
                        lastUpdated: currentDate.toISO(),
                        userId: new ObjectId(safelyParse(req, 'body.userId', parseAsString, existing.userId)),
                        title: safelyParse(req, 'body.title', parseAsString, existing.title),
                        lineOne: safelyParse(req, 'body.lineOne', parseAsString, existing.lineOne),
                        lineTwo: safelyParse(req, 'body.lineTwo', parseAsString, existing.lineTwo),
                        city: safelyParse(req, 'body.city', parseAsString, existing.city),
                        postcode: safelyParse(req, 'body.postcode', parseAsString, existing.postcode),
                        county: safelyParse(req, 'body.county', parseAsString, existing.county),
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

export default editAddress;
