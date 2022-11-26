import { DateTime } from 'luxon';
import { NextApiRequest, NextApiResponse } from 'next';

import { connectToDatabase } from '../../../middleware/database';
import { errorHandler } from '../../../middleware/errors';
import { parseAsNumber, parseAsString, safelyParse } from '../../../utils/parsers';

const defaultErr = 'Product type could not be added.';

async function addProductTypes(req: NextApiRequest, res: NextApiResponse): Promise<void> {
    if (req.method === 'POST') {
        try {
            const { db } = await connectToDatabase();
            const productTypesCollection = db.collection('productTypes');

            const slug = safelyParse(req, 'body.slug', parseAsString, null);
            const existingProductType = await productTypesCollection.findOne({ slug });
            const currentDate = DateTime.now().setZone('Europe/London');

            if (existingProductType) {
                res.status(400).json({ message: 'Product type already exists.' });
                return;
            }

            await productTypesCollection.insertOne({
                title: safelyParse(req, 'body.title', parseAsString, null),
                slug,
            });

            res.status(201).end();
        } catch (err: unknown) {
            const status = safelyParse(err, 'response.status', parseAsNumber, 500);

            res.status(status).json(errorHandler(err, defaultErr));
        }

        return Promise.resolve();
    }
}

export default addProductTypes;
