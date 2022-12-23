import { sum } from 'lodash';
import { ObjectId } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';

import { connectToDatabase } from '../../../middleware/database';
import { errorHandler } from '../../../middleware/errors';
import { FetchCartTotals } from '../../../types/cart';
import { parseAsNumber, safelyParse } from '../../../utils/parsers';

const defaultErr = 'No products found.';

async function calculateTotals(req: NextApiRequest, res: NextApiResponse): Promise<void> {
    if (req.method === 'POST') {
        try {
            const { db } = await connectToDatabase();

            const productsCollection = db.collection('products');
            const items: FetchCartTotals[] = req.body.items;
            const objectIds = items.map((item) => new ObjectId(item.id));

            const productList = await productsCollection
                .find(
                    {
                        _id: { $in: objectIds },
                    },
                    { skip: 0, limit: objectIds.length }
                )
                .project({ price: 1, salePrice: 1 })
                .toArray();

            const prices = items.map(({ id, quantity }) => {
                const matchingProduct = productList.find(({ _id }) => _id.toString() === id);
                const price = safelyParse(matchingProduct, 'price', parseAsNumber, 0);
                const salePrice = safelyParse(matchingProduct, 'salePrice', parseAsNumber, 0);
                const shouldUseSalePrice = salePrice > 0 && salePrice !== price;
                const chosenPrice = shouldUseSalePrice ? salePrice : price;

                return chosenPrice * quantity;
            });

            res.status(200).json({
                subTotal: sum(prices),
                shipping: 0,
                discount: 0,
                total: sum(prices),
            });
        } catch (err: unknown) {
            const status = safelyParse(err, 'response.status', parseAsNumber, 500);

            res.status(status).json(errorHandler(err, defaultErr));
        }

        return Promise.resolve();
    }
}

export default calculateTotals;
