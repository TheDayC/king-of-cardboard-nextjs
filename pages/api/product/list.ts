import { ObjectId } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';

import { connectToDatabase } from '../../../middleware/database';
import { errorHandler } from '../../../middleware/errors';
import {
    parseAsArrayOfStrings,
    parseAsBoolean,
    parseAsNumber,
    parseAsString,
    safelyParse,
} from '../../../utils/parsers';

const defaultErr = 'Product could not be added.';

async function listProducts(req: NextApiRequest, res: NextApiResponse): Promise<void> {
    if (req.method === 'GET') {
        try {
            const { db } = await connectToDatabase();

            const productsCollection = db.collection('products');
            const count = safelyParse(req, 'body.count', parseAsNumber, 10);
            const page = safelyParse(req, 'body.page', parseAsNumber, 0);

            const productCount = await productsCollection.countDocuments();
            const productList = await productsCollection.find().skip(page).limit(count).toArray();

            if (productList.length === 0) {
                res.status(400).json({ message: 'Could not find any products.' });
                return;
            }

            res.status(200).json({ products: productList, count: productCount });
        } catch (err: unknown) {
            const status = safelyParse(err, 'response.status', parseAsNumber, 500);

            res.status(status).json(errorHandler(err, defaultErr));
        }

        return Promise.resolve();
    }
}

export default listProducts;
