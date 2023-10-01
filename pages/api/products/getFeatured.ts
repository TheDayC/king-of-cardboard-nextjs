import { NextApiRequest, NextApiResponse } from 'next';

import { connectToDatabase } from '../../../middleware/database';
import { errorHandler } from '../../../middleware/errors';
import { parseAsNumber, safelyParse } from '../../../utils/parsers';

const defaultErr = 'Could not find product.';

async function getFeatured(req: NextApiRequest, res: NextApiResponse): Promise<void> {
    if (req.method === 'GET') {
        try {
            const { db } = await connectToDatabase();

            const productsCollection = db.collection('products');
            const existingProduct = await productsCollection.findOne({ isFeatured: true });

            if (!existingProduct) {
                res.status(400).json({ message: 'Product does not exist.' });
                return;
            }

            res.status(200).json(existingProduct);
        } catch (err: unknown) {
            const status = safelyParse(err, 'response.status', parseAsNumber, 500);

            res.status(status).json(errorHandler(err, defaultErr));
        }

        return Promise.resolve();
    }
}

export default getFeatured;
