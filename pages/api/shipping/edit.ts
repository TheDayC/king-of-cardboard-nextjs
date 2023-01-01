import { DateTime } from 'luxon';
import { ObjectId } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';

import { connectToDatabase } from '../../../middleware/database';
import { errorHandler } from '../../../middleware/errors';
import { parseAsNumber, parseAsString, safelyParse } from '../../../utils/parsers';

const defaultErr = 'Shipping method could not be updated.';

async function editShipping(req: NextApiRequest, res: NextApiResponse): Promise<void> {
    if (req.method === 'PUT') {
        try {
            const { db } = await connectToDatabase();
            const shippingCollection = db.collection('shipping');

            const id = safelyParse(req, 'body.id', parseAsString, '');
            const existing = await shippingCollection.findOne({ _id: new ObjectId(id) });
            const currentDate = DateTime.now().setZone('Europe/London');

            if (!existing) {
                res.status(400).json({ message: 'Shipping method does not exist.' });
                return;
            }

            await shippingCollection.updateOne(
                { _id: new ObjectId(id) },
                {
                    $set: {
                        lastUpdated: new Date(currentDate.toISO()),
                        title: safelyParse(req, 'body.title', parseAsString, existing.title),
                        slug: safelyParse(req, 'body.slug', parseAsString, existing.slug),
                        content: safelyParse(req, 'body.content', parseAsString, existing.content),
                        supplier: safelyParse(req, 'body.supplier', parseAsNumber, existing.supplier),
                        price: safelyParse(req, 'body.price', parseAsNumber, existing.price),
                        min: safelyParse(req, 'body.min', parseAsNumber, existing.min),
                        max: safelyParse(req, 'body.max', parseAsNumber, existing.max),
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

export default editShipping;
