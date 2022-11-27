import { ObjectId } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';

import { connectToDatabase } from '../../../middleware/database';
import { errorHandler } from '../../../middleware/errors';
import { parseAsNumber, parseAsString, safelyParse } from '../../../utils/parsers';

const defaultErr = 'Could not find product type.';

async function getProductType(req: NextApiRequest, res: NextApiResponse): Promise<void> {
    if (req.method === 'GET') {
        try {
            const { db } = await connectToDatabase();
            const productTypesCollection = db.collection('productTypes');

            const id = safelyParse(req, 'body.id', parseAsString, '');
            const existingProductType = await productTypesCollection.findOne({ _id: new ObjectId(id) });

            if (!existingProductType) {
                res.status(400).json({ message: defaultErr });
                return;
            }

            res.status(200).json(existingProductType);
        } catch (err: unknown) {
            const status = safelyParse(err, 'response.status', parseAsNumber, 500);

            res.status(status).json(errorHandler(err, defaultErr));
        }

        return Promise.resolve();
    }
}

export default getProductType;