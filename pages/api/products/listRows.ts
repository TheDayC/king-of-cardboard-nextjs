import { NextApiRequest, NextApiResponse } from 'next';

import { Interest, StockStatus } from '../../../enums/products';
import { connectToDatabase } from '../../../middleware/database';
import { errorHandler } from '../../../middleware/errors';
import { parseAsNumber, safelyParse } from '../../../utils/parsers';

const defaultErr = 'No products found.';

async function listRows(req: NextApiRequest, res: NextApiResponse): Promise<void> {
    if (req.method === 'POST') {
        try {
            const { db } = await connectToDatabase();

            const productsCollection = db.collection('products');
            const productList = await productsCollection
                .aggregate([
                    {
                        $facet: {
                            baseball: [
                                { $match: { interest: Interest.Baseball, stockStatus: StockStatus.InStock } },
                                { $sort: { created: -1 } },
                                { $limit: 4 },
                            ],
                            basketball: [
                                { $match: { interest: Interest.Basketball, stockStatus: StockStatus.InStock } },
                                { $sort: { created: -1 } },
                                { $limit: 4 },
                            ],
                            football: [
                                { $match: { interest: Interest.Football, stockStatus: StockStatus.InStock } },
                                { $sort: { created: -1 } },
                                { $limit: 4 },
                            ],
                            soccer: [
                                { $match: { interest: Interest.Soccer, stockStatus: StockStatus.InStock } },
                                { $sort: { created: -1 } },
                                { $limit: 4 },
                            ],
                            ufc: [
                                { $match: { interest: Interest.UFC, stockStatus: StockStatus.InStock } },
                                { $sort: { created: -1 } },
                                { $limit: 4 },
                            ],
                            wrestling: [
                                { $match: { interest: Interest.Wrestling, stockStatus: StockStatus.InStock } },
                                { $sort: { created: -1 } },
                                { $limit: 4 },
                            ],
                            pokemon: [
                                { $match: { interest: Interest.Pokemon, stockStatus: StockStatus.InStock } },
                                { $sort: { created: -1 } },
                                { $limit: 4 },
                            ],
                            other: [
                                { $match: { interest: Interest.Other, stockStatus: StockStatus.InStock } },
                                { $sort: { created: -1 } },
                                { $limit: 4 },
                            ],
                            f1: [
                                { $match: { interest: Interest.F1, stockStatus: StockStatus.InStock } },
                                { $sort: { created: -1 } },
                                { $limit: 4 },
                            ],
                        },
                    },
                ])
                .toArray();

            res.status(200).json(productList[0]);
        } catch (err: unknown) {
            const status = safelyParse(err, 'response.status', parseAsNumber, 500);

            res.status(status).json(errorHandler(err, defaultErr));
        }

        return Promise.resolve();
    }
}

export default listRows;
