import { DateTime } from 'luxon';
import { NextApiRequest, NextApiResponse } from 'next';

import { Supplier } from '../../../enums/shipping';
import { connectToDatabase } from '../../../middleware/database';
import { errorHandler } from '../../../middleware/errors';
import { parseAsNumber, parseAsString, safelyParse } from '../../../utils/parsers';

const defaultErr = 'Shipping method could not be added.';

async function addShipping(req: NextApiRequest, res: NextApiResponse): Promise<void> {
    if (req.method === 'POST') {
        try {
            const { db } = await connectToDatabase();
            const collection = db.collection('shipping');
            const slug = safelyParse(req, 'body.slug', parseAsString, null);
            const existing = await collection.findOne({ slug });
            const currentDate = DateTime.now().setZone('Europe/London');

            if (existing) {
                res.status(400).json({ message: 'Shipping method already exists.' });
                return;
            }

            await collection.insertOne({
                created: currentDate.toISO(),
                lastUpdated: currentDate.toISO(),
                title: safelyParse(req, 'body.title', parseAsString, null),
                slug,
                content: safelyParse(req, 'body.content', parseAsString, null),
                supplier: safelyParse(req, 'body.supplier', parseAsNumber, Supplier.RoyalMail),
                price: safelyParse(req, 'body.price', parseAsNumber, 0),
                min: safelyParse(req, 'body.min', parseAsNumber, 5),
                max: safelyParse(req, 'body.max', parseAsNumber, 10),
            });

            res.status(201).end();
        } catch (err: unknown) {
            const status = safelyParse(err, 'response.status', parseAsNumber, 500);

            res.status(status).json(errorHandler(err, defaultErr));
        }

        return Promise.resolve();
    }
}

export default addShipping;
