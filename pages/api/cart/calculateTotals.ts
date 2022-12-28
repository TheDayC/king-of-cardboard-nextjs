import { sum } from 'lodash';
import { Db, ObjectId } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';

import { connectToDatabase } from '../../../middleware/database';
import { errorHandler } from '../../../middleware/errors';
import { FetchCartItems } from '../../../types/cart';
import { calculateExcessCoinSpend } from '../../../utils/order';
import { parseAsNumber, parseAsString, safelyParse } from '../../../utils/parsers';

const defaultErr = 'Error in cart.';

async function getShippingPrice(methodId: string | null, db: Db): Promise<number> {
    if (!methodId) return 0;

    const shippingCollection = db.collection('shipping');
    const shippingList = await shippingCollection
        .find(
            {
                _id: new ObjectId(methodId),
            },
            { skip: 0, limit: 1 }
        )
        .project({ price: 1 })
        .toArray();

    return safelyParse(shippingList[0], 'price', parseAsNumber, 0);
}

async function calculateTotals(req: NextApiRequest, res: NextApiResponse): Promise<void> {
    if (req.method === 'POST') {
        try {
            const { db } = await connectToDatabase();

            const productsCollection = db.collection('products');
            const items: FetchCartItems[] = req.body.items || [];
            const itemIds = items.map((item) => new ObjectId(item.id));
            const shippingMethodId = safelyParse(req, 'body.shippingMethodId', parseAsString, null);

            const productList = await productsCollection
                .find(
                    {
                        _id: { $in: itemIds },
                    },
                    { skip: 0, limit: itemIds.length }
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
            const subTotal = sum(prices);
            const shippingPrice = await getShippingPrice(shippingMethodId, db);
            const coins: number = req.body.coins || 0;
            const excessCoins = calculateExcessCoinSpend(coins, subTotal);
            const discount = coins - excessCoins;
            const total = subTotal + shippingPrice;

            res.status(200).json({
                subTotal,
                shipping: shippingPrice,
                discount,
                total: total - discount,
            });
        } catch (err: unknown) {
            const status = safelyParse(err, 'response.status', parseAsNumber, 500);

            res.status(status).json(errorHandler(err, defaultErr));
        }

        return Promise.resolve();
    }
}

export default calculateTotals;
