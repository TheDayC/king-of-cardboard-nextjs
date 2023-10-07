import { NextApiRequest, NextApiResponse } from 'next';
import { toNumber } from 'lodash';
import { ObjectId } from 'mongodb';

import { connectToDatabase } from '../../../middleware/database';
import { errorHandler } from '../../../middleware/errors';
import { parseAsNumber, safelyParse } from '../../../utils/parsers';
import { StockStatus } from '../../../enums/products';
import { isString } from '../../../utils/typeguards';

const defaultErr = 'No products found.';

async function crossSales(req: NextApiRequest, res: NextApiResponse): Promise<void> {
    if (req.method === 'GET') {
        try {
            const { db } = await connectToDatabase();

            const productsCollection = db.collection('products');
            const id = isString(req.query.id) ? req.query.id : '';
            const category = toNumber(req.query.category);
            const interest = toNumber(req.query.interest);
            const configuration = toNumber(req.query.configuration);

            const productList = await productsCollection
                .find(
                    {
                        $and: [
                            { _id: { $ne: new ObjectId(id) } },
                            { category: { $eq: category } },
                            { interest: { $eq: interest } },
                            { configuration: { $eq: configuration } },
                            { stockStatus: { $in: [StockStatus.InStock, StockStatus.Import, StockStatus.PreOrder] } },
                        ],
                    },
                    { skip: 0, limit: 4, sort: { created: -1 } }
                )
                .toArray();

            res.status(200).json({ products: productList });
        } catch (err: unknown) {
            const status = safelyParse(err, 'response.status', parseAsNumber, 500);

            res.status(status).json(errorHandler(err, defaultErr));
        }

        return Promise.resolve();
    }
}

export default crossSales;
