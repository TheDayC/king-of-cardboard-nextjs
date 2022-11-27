import { DateTime } from 'luxon';
import { NextApiRequest, NextApiResponse } from 'next';
import { Fulfillment, Payment, Status } from '../../../enums/orders';

import { connectToDatabase } from '../../../middleware/database';
import { errorHandler } from '../../../middleware/errors';
import { parseAsBoolean, parseAsNumber, parseAsString, safelyParse } from '../../../utils/parsers';

const defaultErr = 'Order could not be added.';

async function addOrder(req: NextApiRequest, res: NextApiResponse): Promise<void> {
    if (req.method === 'POST') {
        try {
            const { db } = await connectToDatabase();
            const orderCollection = db.collection('orders');

            const orderNumber = safelyParse(req, 'body.orderNumber', parseAsString, null);
            const existingOrder = await orderCollection.findOne({ orderNumber });
            const currentDate = DateTime.now().setZone('Europe/London');

            if (existingOrder) {
                res.status(400).json({ message: 'Order already exists.' });
                return;
            }

            await orderCollection.insertOne({
                email: safelyParse(req, 'body.email', parseAsString, null),
                status: Status.Placed,
                payment: Payment.Unpaid,
                fulfillment: Fulfillment.Unfulfilled,
                created: currentDate.toISO(),
                lastUpdated: currentDate.toISO(),
                lineItems: safelyParse(req, 'body.lineItems', parseAsString, null),
                subTotal: safelyParse(req, 'body.subTotal', parseAsNumber, 0),
                discount: safelyParse(req, 'body.discount', parseAsNumber, 0),
                adjustment: safelyParse(req, 'body.adjustment', parseAsNumber, 0),
                shipping: safelyParse(req, 'body.shipping', parseAsString, null),
                tax: safelyParse(req, 'body.tax', parseAsNumber, 0),
                isTaxIncluded: safelyParse(req, 'body.isTaxIncluded', parseAsBoolean, true),
                total: safelyParse(req, 'body.total', parseAsNumber, 0),
                shippingAddress: safelyParse(req, 'body.shippingAddress', parseAsString, null),
                billingAddress: safelyParse(req, 'body.billingAddress', parseAsString, null),
                paymentSource: safelyParse(req, 'body.paymentSource', parseAsString, null),
            });

            res.status(201).end();
        } catch (err: unknown) {
            const status = safelyParse(err, 'response.status', parseAsNumber, 500);

            res.status(status).json(errorHandler(err, defaultErr));
        }

        return Promise.resolve();
    }
}

export default addOrder;
