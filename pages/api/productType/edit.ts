import { DateTime } from 'luxon';
import { ObjectId } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';

import { connectToDatabase } from '../../../middleware/database';
import { errorHandler } from '../../../middleware/errors';
import { parseAsNumber, parseAsString, safelyParse } from '../../../utils/parsers';

const defaultErr = 'Product type could not be updated.';

async function editProductType(req: NextApiRequest, res: NextApiResponse): Promise<void> {
    if (req.method === 'PUT') {
        try {
            const { db } = await connectToDatabase();
            const productTypesCollection = db.collection('productTypes');

            const id = safelyParse(req, 'body.id', parseAsString, '');
            const existingProductType = await productTypesCollection.findOne({ _id: new ObjectId(id) });
            const currentDate = DateTime.now().setZone('Europe/London');

            if (!existingProductType) {
                res.status(400).json({ message: 'Product type does not exist.' });
                return;
            }

            await productTypesCollection.updateOne(
                { _id: new ObjectId(id) },
                {
                    $set: {
                        title: safelyParse(req, 'body.title', parseAsString, null),
                        slug: safelyParse(req, 'body.slug', parseAsString, null),
                        created: existingProductType.created,
                        lastUpdated: currentDate.toISO(),
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

export default editProductType;
