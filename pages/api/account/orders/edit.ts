import axios from 'axios';
import { toNumber } from 'lodash';
import { DateTime } from 'luxon';
import { ObjectId } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';
import { Fulfillment, Payment, Status } from '../../../../enums/orders';
import { Category, Configuration, Interest } from '../../../../enums/products';

import { connectToDatabase } from '../../../../middleware/database';
import { errorHandler } from '../../../../middleware/errors';
import { CartItem } from '../../../../types/cart';
import { Address, CustomerDetails } from '../../../../types/checkout';
import { RepeaterItem } from '../../../../types/orders';
import { parseAsNumber, parseAsString, safelyParse } from '../../../../utils/parsers';

const defaultErr = 'Order could not be updated.';

async function editOrder(req: NextApiRequest, res: NextApiResponse): Promise<void> {
    if (req.method === 'PUT') {
        try {
            const { db } = await connectToDatabase();
            const ordersCollection = db.collection('orders');
            const productsCollection = db.collection('products');

            const id = new ObjectId(safelyParse(req, 'body.id', parseAsString, ''));
            const existingOrder = await ordersCollection.findOne({ _id: id });

            if (!existingOrder) {
                res.status(404).json({ message: 'Order does not exist.' });
                return;
            }

            const currentDate = DateTime.now().setZone('Europe/London');
            const email = safelyParse(req, 'body.email', parseAsString, '');
            const orderStatus = safelyParse(req, 'body.orderStatus', parseAsNumber, Status.Placed);
            const paymentStatus = safelyParse(req, 'body.paymentStatus', parseAsNumber, Payment.Unpaid);
            const fulfillmentStatus = safelyParse(
                req,
                'body.fulfillmentStatus',
                parseAsNumber,
                Fulfillment.Unfulfilled
            );
            const userId = safelyParse(req, 'body.userId', parseAsString, null);
            const customerDetails = req.body.customerDetails as CustomerDetails;
            const shippingAddress = req.body.shippingAddress as Address;
            const billingAddress = req.body.billingAddress as Address;
            const paymentId = safelyParse(req, 'body.paymentId', parseAsString, null);
            const paymentMethod = safelyParse(req, 'body.paymentMethod', parseAsNumber, null);
            const repeaterItems: RepeaterItem[] = req.body.repeaterItems || [];
            const shippingMethodId = safelyParse(req, 'body.shippingMethodId', parseAsString, '');

            const foundItems = await productsCollection
                .find({ sku: { $in: repeaterItems.map((item) => item.sku) } })
                .toArray();

            const items = repeaterItems.map((item) => {
                const matchingItem = foundItems.find((fI) => fI.sku === item.sku);
                const title = safelyParse(matchingItem, 'title', parseAsString, '');
                const mainImage = safelyParse(matchingItem, 'mainImage', parseAsString, '');

                return {
                    _id: matchingItem ? matchingItem._id.toString() : '',
                    sku: safelyParse(matchingItem, 'sku', parseAsString, ''),
                    title,
                    slug: safelyParse(matchingItem, 'slug', parseAsString, ''),
                    category: safelyParse(matchingItem, 'category', parseAsNumber, Category.Other),
                    configuration: safelyParse(matchingItem, 'configuration', parseAsNumber, Configuration.Other),
                    interest: safelyParse(matchingItem, 'interest', parseAsNumber, Interest.Other),
                    quantity: toNumber(item.quantity),
                    price: safelyParse(matchingItem, 'price', parseAsNumber, Interest.Other),
                    salePrice: safelyParse(matchingItem, 'salePrice', parseAsNumber, Interest.Other),
                    mainImage: {
                        title: `${title} main image`,
                        description: `${title} main image`,
                        url: `${process.env.NEXT_PUBLIC_AWS_S3_URL}${mainImage}`,
                    },
                    stock: safelyParse(matchingItem, 'stock', parseAsNumber, 0),
                    cartQty: safelyParse(matchingItem, 'cartQty', parseAsNumber, 0),
                };
            });

            // As we're adding short items via the admin panel we need to calc the totals.
            const data = {
                items: items.map((item) => ({ id: item._id.toString(), quantity: toNumber(item.quantity) })),
                coins: 0,
                shippingMethodId,
            };

            const totalsRes = await axios.post(
                `${process.env.NEXT_PUBLIC_SITE_URL || ''}/api/cart/calculateTotals`,
                data
            );

            const subTotal = safelyParse(totalsRes, 'data.subTotal', parseAsNumber, 0);
            const shipping = safelyParse(totalsRes, 'data.shipping', parseAsNumber, 0);
            const discount = safelyParse(totalsRes, 'data.discount', parseAsNumber, 0);
            const total = safelyParse(totalsRes, 'data.total', parseAsNumber, 0);

            await ordersCollection.updateOne(
                { _id: id },
                {
                    $set: {
                        userId,
                        email,
                        orderStatus,
                        paymentStatus,
                        fulfillmentStatus,
                        items,
                        lastUpdated: currentDate.toISO(),
                        subTotal,
                        discount,
                        shipping,
                        total,
                        customerDetails,
                        shippingAddress,
                        billingAddress,
                        paymentId,
                        paymentMethod,
                        shippingMethodId,
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
