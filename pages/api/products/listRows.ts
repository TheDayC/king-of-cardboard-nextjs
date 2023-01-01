import { NextApiRequest, NextApiResponse } from 'next';

import { Interest } from '../../../enums/products';
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
                                { $match: { interest: Interest.Baseball } },
                                { $sort: { created: -1 } },
                                { $limit: 4 },
                            ],
                            basketball: [
                                { $match: { interest: Interest.Basketball } },
                                { $sort: { created: -1 } },
                                { $limit: 4 },
                            ],
                            football: [
                                { $match: { interest: Interest.Football } },
                                { $sort: { created: -1 } },
                                { $limit: 4 },
                            ],
                            soccer: [
                                { $match: { interest: Interest.Soccer } },
                                { $sort: { created: -1 } },
                                { $limit: 4 },
                            ],
                            ufc: [{ $match: { interest: Interest.UFC } }, { $sort: { created: -1 } }, { $limit: 4 }],
                            wrestling: [
                                { $match: { interest: Interest.Wrestling } },
                                { $sort: { created: -1 } },
                                { $limit: 4 },
                            ],
                            pokemon: [
                                { $match: { interest: Interest.Pokemon } },
                                { $sort: { created: -1 } },
                                { $limit: 4 },
                            ],
                            other: [
                                { $match: { interest: Interest.Other } },
                                { $sort: { created: -1 } },
                                { $limit: 4 },
                            ],
                        },
                    },
                ])
                .toArray();

            res.status(200).json(productList[0]);
        } catch (err: unknown) {
            console.log('🚀 ~ file: listRows.ts:65 ~ listRows ~ err', err);
            const status = safelyParse(err, 'response.status', parseAsNumber, 500);

            res.status(status).json(errorHandler(err, defaultErr));
        }

        return Promise.resolve();
    }
}

export default listRows;
