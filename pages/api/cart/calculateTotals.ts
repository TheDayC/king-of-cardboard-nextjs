import { sum } from 'lodash';
import { Db, ObjectId } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';

import { connectToDatabase } from '../../../middleware/database';
import { errorHandler } from '../../../middleware/errors';
import { FetchCartItems } from '../../../types/cart';
import { calculateExcessCoinSpend } from '../../../utils/account/order';
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
            const subTotal = sum(prices); // Add up all prices to get the sub total.
            const shipping = await getShippingPrice(shippingMethodId, db); // Fetch the shipping cost.
            const coins: number = req.body.coins || 0; // Fetch the coins being used.
            const excessCoins = calculateExcessCoinSpend(coins, subTotal); // Figure out if we're overspending coins and by how much.
            const discount = coins - excessCoins; // Reduce discount by excess coin amount so system can't owe user money and they keep their excess coins.
            const total = subTotal + shipping - discount; // Find total

            res.status(200).json({
                subTotal,
                shipping,
                discount,
                total,
            });
        } catch (err: unknown) {
            const status = safelyParse(err, 'response.status', parseAsNumber, 500);

            res.status(status).json(errorHandler(err, defaultErr));
        }

        return Promise.resolve();
    }
}

export default calculateTotals;
