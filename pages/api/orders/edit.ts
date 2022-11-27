import { DateTime } from 'luxon';
import { ObjectId } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';

import { connectToDatabase } from '../../../middleware/database';
import { errorHandler } from '../../../middleware/errors';
import {
    parseAsArrayOfStrings,
    parseAsBoolean,
    parseAsNumber,
    parseAsString,
    safelyParse,
} from '../../../utils/parsers';

const defaultErr = 'Order could not be updated.';

async function editOrder(req: NextApiRequest, res: NextApiResponse): Promise<void> {
    if (req.method === 'PUT') {
        try {
            const { db } = await connectToDatabase();
            const ordersCollection = db.collection('orders');

            const id = new ObjectId(safelyParse(req, 'body.id', parseAsString, ''));
            const existingOrder = await ordersCollection.findOne({ _id: id });
            const currentDate = DateTime.now().setZone('Europe/London');

            if (!existingOrder) {
                res.status(400).json({ message: 'Order does not exist.' });
                return;
            }

            await ordersCollection.updateOne(
                { _id: id },
                {
                    $set: {
                        email: safelyParse(req, 'body.email', parseAsString, existingOrder.email),
                        status: safelyParse(req, 'body.status', parseAsNumber, existingOrder.status),
                        payment: safelyParse(req, 'body.payment', parseAsNumber, existingOrder.payment),
                        fulfillment: safelyParse(req, 'body.fulfillment', parseAsNumber, existingOrder.fulfillment),
                        lastUpdated: currentDate.toISO(),
                        lineItems: safelyParse(req, 'body.lineItems', parseAsString, existingOrder.lineItems),
                        subTotal: safelyParse(req, 'body.subTotal', parseAsNumber, existingOrder.subTotal),
                        discount: safelyParse(req, 'body.discount', parseAsNumber, existingOrder.discount),
                        adjustment: safelyParse(req, 'body.adjustment', parseAsNumber, existingOrder.adjustment),
                        shipping: safelyParse(req, 'body.shipping', parseAsString, existingOrder.shipping),
                        tax: safelyParse(req, 'body.tax', parseAsNumber, existingOrder.tax),
                        isTaxIncluded: safelyParse(
                            req,
                            'body.isTaxIncluded',
                            parseAsBoolean,
                            existingOrder.isTaxIncluded
                        ),
                        total: safelyParse(req, 'body.total', parseAsNumber, existingOrder.total),
                        shippingAddress: safelyParse(
                            req,
                            'body.shippingAddress',
                            parseAsString,
                            existingOrder.shippingAddress
                        ),
                        billingAddress: safelyParse(
                            req,
                            'body.billingAddress',
                            parseAsString,
                            existingOrder.billingAddress
                        ),
                        paymentSource: safelyParse(
                            req,
                            'body.paymentSource',
                            parseAsString,
                            existingOrder.paymentSource
                        ),
                    },
                }
            );

            res.status(204).end();
        } catch (err: unknown) {
            const status = safelyParse(err, 'response.status', parseAsNumber, 500);

            res.status(status).json(errorHandler(err, defaultErr));
        }

        return Promise.resolve();
    }
}

export default editOrder;
