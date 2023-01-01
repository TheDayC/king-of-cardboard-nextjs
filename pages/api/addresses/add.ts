import { DateTime } from 'luxon';
import { ObjectId } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';

import { connectToDatabase } from '../../../middleware/database';
import { errorHandler } from '../../../middleware/errors';
import { parseAsNumber, parseAsString, safelyParse } from '../../../utils/parsers';

const defaultErr = 'Address could not be added.';

async function addAddress(req: NextApiRequest, res: NextApiResponse): Promise<void> {
    if (req.method === 'POST') {
        try {
            const { db } = await connectToDatabase();
            const collection = db.collection('addresses');
            const currentDate = DateTime.now().setZone('Europe/London');

            await collection.insertOne({
                created: new Date(currentDate.toISO()),
                lastUpdated: new Date(currentDate.toISO()),
                userId: new ObjectId(safelyParse(req, 'body.userId', parseAsString, '')),
                title: safelyParse(req, 'body.title', parseAsString, ''),
                lineOne: safelyParse(req, 'body.lineOne', parseAsString, ''),
                lineTwo: safelyParse(req, 'body.lineTwo', parseAsString, ''),
                city: safelyParse(req, 'body.city', parseAsString, ''),
                postcode: safelyParse(req, 'body.postcode', parseAsString, ''),
                county: safelyParse(req, 'body.county', parseAsString, ''),
            });

            res.status(201).end();
        } catch (err: unknown) {
            const status = safelyParse(err, 'response.status', parseAsNumber, 500);

            res.status(status).json(errorHandler(err, defaultErr));
        }

        return Promise.resolve();
    }
}

export default addAddress;
