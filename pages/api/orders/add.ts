import { DateTime } from 'luxon';
import { ObjectId } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';

import { Fulfillment, Payment, Status } from '../../../enums/orders';
import { connectToDatabase } from '../../../middleware/database';
import { errorHandler } from '../../../middleware/errors';
import { CartItem } from '../../../types/cart';
import { parseAsNumber, parseAsString, safelyParse } from '../../../utils/parsers';

const defaultErr = 'Order could not be added.';
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function addOrder(req: NextApiRequest, res: NextApiResponse): Promise<void> {
    if (req.method === 'POST') {
        try {
            const { db } = await connectToDatabase();
            const collection = db.collection('orders');
            const productsCollection = db.collection('products');
            const usersCollection = db.collection('users');
            const currentDate = DateTime.now().setZone('Europe/London');
            const items: CartItem[] = req.body.items || [];
            const discount = safelyParse(req, 'body.discount', parseAsNumber, 0);
            const userId = safelyParse(req, 'body.userId', parseAsString, null);

            const { insertedId } = await collection.insertOne({
                userId,
                email: safelyParse(req, 'body.email', parseAsString, null),
                orderStatus: safelyParse(req, 'body.orderStatus', parseAsNumber, Status.Placed),
                paymentStatus: safelyParse(req, 'body.paymentStatus', parseAsNumber, Payment.Unpaid),
                fulfillmentStatus: safelyParse(req, 'body.fulfillmentStatus', parseAsNumber, Fulfillment.Unfulfilled),
                items,
                created: currentDate.toISO(),
                lastUpdated: currentDate.toISO(),
                subTotal: safelyParse(req, 'body.subTotal', parseAsNumber, 0),
                discount,
                shipping: safelyParse(req, 'body.shipping', parseAsString, null),
                total: safelyParse(req, 'body.total', parseAsNumber, 0),
                shippingAddress: safelyParse(req, 'body.shippingAddress', parseAsString, null),
                billingAddress: safelyParse(req, 'body.billingAddress', parseAsString, null),
                paymentId: safelyParse(req, 'body.paymentId', parseAsString, null),
                paymentMethod: safelyParse(req, 'body.paymentMethod', parseAsNumber, null),
            });

            // Reduce item stock counts.
            for (const item of items) {
                await productsCollection.findOneAndUpdate(
                    { _id: new ObjectId(item._id) },
                    { $inc: { quantity: -item.quantity } }
                );
            }

            // Reduce user's coins if discount is larger than zero.
            if (discount > 0 && userId) {
                await usersCollection.findOneAndUpdate({ _id: new ObjectId(userId) }, { $inc: { coins: -discount } });
            }

            // Wait 1 second for the trigger to finish.
            await delay(2000);

            // Fetch the order number.
            const existingOrder = await collection.findOne({ _id: insertedId }, { projection: { orderNumber: 1 } });

            if (!existingOrder) {
                res.status(404).json({ message: 'Could not find order.' });
                return Promise.resolve();
            }

            const orderNumber = safelyParse(existingOrder, 'orderNumber', parseAsNumber, null);

            res.status(200).json({ _id: existingOrder._id.toString(), orderNumber });
        } catch (err: unknown) {
            const status = safelyParse(err, 'response.status', parseAsNumber, 500);

            res.status(status).json(errorHandler(err, defaultErr));
        }

        return Promise.resolve();
    }
}

export default addOrder;
