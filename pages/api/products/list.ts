import { NextApiRequest, NextApiResponse } from 'next';

import { connectToDatabase } from '../../../middleware/database';
import { errorHandler } from '../../../middleware/errors';
import { buildProductListMongoQueryValues } from '../../../utils/account/database';
import { parseAsArrayOfNumbers, parseAsNumber, safelyParse } from '../../../utils/parsers';

const defaultErr = 'Could not find any products.';

async function listProducts(req: NextApiRequest, res: NextApiResponse): Promise<void> {
    if (req.method === 'POST') {
        try {
            const { db } = await connectToDatabase();

            const productsCollection = db.collection('products');
            const count = safelyParse(req, 'body.count', parseAsNumber, 10);
            const page = safelyParse(req, 'body.page', parseAsNumber, 0);
            const categories = safelyParse(req, 'body.categories', parseAsArrayOfNumbers, null);
            const interests = safelyParse(req, 'body.interests', parseAsArrayOfNumbers, null);
            const configurations = safelyParse(req, 'body.configurations', parseAsArrayOfNumbers, null);
            const stockStatuses = safelyParse(req, 'body.stockStatuses', parseAsArrayOfNumbers, null);
            const query = buildProductListMongoQueryValues(categories, interests, configurations, stockStatuses);

            const productCount = await productsCollection.countDocuments();
            const productList = await productsCollection
                .find(
                    {
                        ...query,
                    },
                    { skip: page, limit: count }
                )
                .toArray();

            if (productList.length === 0) {
                res.status(400).json({ message: defaultErr });
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
