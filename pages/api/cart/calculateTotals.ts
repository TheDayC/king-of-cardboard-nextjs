import { sum } from 'lodash';
import { ObjectId } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';

import { connectToDatabase } from '../../../middleware/database';
import { errorHandler } from '../../../middleware/errors';
import { FetchCartItems } from '../../../types/cart';
import { parseAsNumber, parseAsString, safelyParse } from '../../../utils/parsers';

const defaultErr = 'No products found.';

async function calculateTotals(req: NextApiRequest, res: NextApiResponse): Promise<void> {
    if (req.method === 'POST') {
        try {
            const { db } = await connectToDatabase();

            const productsCollection = db.collection('products');
            const shippingCollection = db.collection('shipping');
            const items: FetchCartItems[] = req.body.items || [];
            const coins: number = req.body.coins || 0;
            const discount = coins > 0 ? coins * 0.3 : 0;
            const itemIds = items.map((item) => new ObjectId(item.id));
            const shippingMethodId = safelyParse(req, 'body.shippingMethodId', parseAsString, '');

            const productList = await productsCollection
                .find(
                    {
                        _id: { $in: itemIds },
                    },
                    { skip: 0, limit: itemIds.length }
                )
                .project({ price: 1, salePrice: 1 })
                .toArray();

            const shippingList = await shippingCollection
                .find(
                    {
                        _id: new ObjectId(shippingMethodId),
                    },
                    { skip: 0, limit: 1 }
                )
                .project({ price: 1 })
                .toArray();

            const prices = items.map(({ id, quantity }) => {
                const matchingProduct = productList.find(({ _id }) => _id.toString() === id);
                const price = safelyParse(matchingProduct, 'price', parseAsNumber, 0);
                const salePrice = safelyParse(matchingProduct, 'salePrice', parseAsNumber, 0);
                const shouldUseSalePrice = salePrice > 0 && salePrice !== price;
                const chosenPrice = shouldUseSalePrice ? salePrice : price;

                return chosenPrice * quantity;
            });
            const shippingPrice = safelyParse(shippingList[0], 'price', parseAsNumber, 0);

            res.status(200).json({
                subTotal: sum(prices),
                shipping: shippingPrice,
                discount: coins > 0 ? coins * 0.3 : 0,
                total: sum(prices) + shippingPrice - discount,
            });
        } catch (err: unknown) {
            const status = safelyParse(err, 'response.status', parseAsNumber, 500);

            res.status(status).json(errorHandler(err, defaultErr));
        }

        return Promise.resolve();
    }
}

export default calculateTotals;
