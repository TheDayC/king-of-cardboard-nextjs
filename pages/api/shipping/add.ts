import { DateTime } from 'luxon';
import { NextApiRequest, NextApiResponse } from 'next';

import { connectToDatabase } from '../../../middleware/database';
import { errorHandler } from '../../../middleware/errors';
import { parseAsNumber, parseAsString, safelyParse } from '../../../utils/parsers';

const defaultErr = 'Shipping could not be added.';

async function addShipping(req: NextApiRequest, res: NextApiResponse): Promise<void> {
    if (req.method === 'POST') {
        try {
            const { db } = await connectToDatabase();
            const shippingCollection = db.collection('shipping');

            const slug = safelyParse(req, 'body.slug', parseAsString, null);
            const existingShipping = await shippingCollection.findOne({ slug });
            const currentDate = DateTime.now().setZone('Europe/London');

            if (existingShipping) {
                res.status(400).json({ message: 'Shipping already exists.' });
                return;
            }

            await shippingCollection.insertOne({
                title: safelyParse(req, 'body.title', parseAsString, null),
                slug,
                cost: safelyParse(req, 'body.cost', parseAsNumber, 0),
                created: currentDate.toISO(),
                lastUpdated: currentDate.toISO(),
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
