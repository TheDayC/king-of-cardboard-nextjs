import { ObjectId } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';

import { connectToDatabase } from '../../../middleware/database';
import { errorHandler } from '../../../middleware/errors';
import { parseAsNumber, parseAsString, safelyParse } from '../../../utils/parsers';

const defaultErr = 'Product could not be updated.';

async function deleteProduct(req: NextApiRequest, res: NextApiResponse): Promise<void> {
    if (req.method === 'DELETE') {
        try {
            const { db } = await connectToDatabase();

            const productsCollection = db.collection('products');
            const id = safelyParse(req, 'body.id', parseAsString, null);

            if (!id) {
                res.status(400).json({ message: 'Must supply an id.' });
                return;
            }

            const objectId = new ObjectId(id);
            const existingProduct = await productsCollection.findOne({ _id: objectId });

            if (!existingProduct) {
                res.status(400).json({ message: 'Product does not exist.' });
                return;
            }

            await productsCollection.deleteOne({ _id: objectId });

            res.status(204).end();
        } catch (err: unknown) {
            const status = safelyParse(err, 'response.status', parseAsNumber, 500);

            res.status(status).json(errorHandler(err, defaultErr));
        }

        return Promise.resolve();
    }
}

export default deleteProduct;
