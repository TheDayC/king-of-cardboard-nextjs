import { DateTime } from 'luxon';
import { ObjectId } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';
import sgMail from '@sendgrid/mail';
import { toNumber } from 'lodash';
import axios from 'axios';

import { Fulfillment, Payment, Status } from '../../../enums/orders';
import { connectToDatabase } from '../../../middleware/database';
import { errorHandler } from '../../../middleware/errors';
import { CartItem } from '../../../types/cart';
import { parseAsBoolean, parseAsNumber, parseAsString, safelyParse } from '../../../utils/parsers';
import { Address, CustomerDetails } from '../../../types/checkout';
import { Category, Configuration, Interest, StockStatus } from '../../../enums/products';
import { createImageData, createMailerOptions } from '../../../utils/email';

const defaultErr = 'Order could not be added.';
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

sgMail.setApiKey(process.env.SENDGRID_API_KEY || '');

async function addOrder(req: NextApiRequest, res: NextApiResponse): Promise<void> {
    if (req.method === 'POST') {
        try {
            const { db } = await connectToDatabase();
            const collection = db.collection('orders');
            const productsCollection = db.collection('products');
            const usersCollection = db.collection('users');
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
            let items: CartItem[] = req.body.items || [];
            let subTotal = safelyParse(req, 'body.subTotal', parseAsNumber, 0);
            let shipping = safelyParse(req, 'body.shipping', parseAsNumber, 0);
            let discount = safelyParse(req, 'body.discount', parseAsNumber, 0);
            let total = safelyParse(req, 'body.total', parseAsNumber, 0);
            const userId = safelyParse(req, 'body.userId', parseAsString, null);
            const customerDetails = req.body.customerDetails as CustomerDetails;
            const shippingAddress = req.body.shippingAddress as Address;
            const billingAddress = req.body.billingAddress as Address;
            const paymentId = safelyParse(req, 'body.paymentId', parseAsString, null);
            const paymentMethod = safelyParse(req, 'body.paymentMethod', parseAsNumber, null);
            const shouldFindItems = safelyParse(req, 'body.shouldFindItems', parseAsBoolean, false);
            const shippingMethodId = safelyParse(req, 'body.shippingMethodId', parseAsString, '');

            // If adding items from admin panel we need to find items based on their SKUs
            if (shouldFindItems) {
                const repeaterItems: Record<string, string | number>[] = req.body.repeaterItems || [];

                const foundItems = await productsCollection
                    .find({ sku: { $in: repeaterItems.map((item) => item.sku) } })
                    .toArray();

                items = repeaterItems.map((item) => {
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
                        stockStatus: safelyParse(matchingItem, 'stockStatus', parseAsNumber, StockStatus.InStock),
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
                        releaseDate: safelyParse(matchingItem, 'releaseDate', parseAsString, null),
                        priceHistory: [],
                        metaTitle: safelyParse(matchingItem, 'metaTitle', parseAsString, ''),
                        metaDescription: safelyParse(matchingItem, 'metaDescription', parseAsString, ''),
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

                subTotal = safelyParse(totalsRes, 'data.subTotal', parseAsNumber, 0);
                shipping = safelyParse(totalsRes, 'data.shipping', parseAsNumber, 0);
                discount = safelyParse(totalsRes, 'data.discount', parseAsNumber, 0);
                total = safelyParse(totalsRes, 'data.total', parseAsNumber, 0);
            }

            const { insertedId } = await collection.insertOne({
                userId,
                email,
                orderStatus,
                paymentStatus,
                fulfillmentStatus,
                items,
                created: new Date(currentDate.toISO()),
                lastUpdated: new Date(currentDate.toISO()),
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
                trackingNumber: null,
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

            // Fetch order number and generate item image data.
            const orderNumber = safelyParse(existingOrder, 'orderNumber', parseAsNumber, 0);
            const itemsImgData = await createImageData(items);

            // Send user an order email.
            const mailerOptions = createMailerOptions(
                orderNumber,
                customerDetails.firstName,
                email,
                customerDetails,
                billingAddress,
                shippingAddress,
                items,
                itemsImgData,
                subTotal,
                shipping,
                discount,
                total,
                false,
                null,
                orderStatus,
                paymentStatus,
                fulfillmentStatus,
                false
            );
            await sgMail.send(mailerOptions);

            // Notification email for admin
            const notificationMailerOptions = createMailerOptions(
                orderNumber,
                'King',
                'dayc@kingofcardboard.co.uk',
                customerDetails,
                billingAddress,
                shippingAddress,
                items,
                itemsImgData,
                subTotal,
                shipping,
                discount,
                total,
                true,
                null,
                orderStatus,
                paymentStatus,
                fulfillmentStatus,
                false
            );
            await sgMail.send(notificationMailerOptions);

            res.status(200).json({
                _id: existingOrder._id.toString(),
                orderNumber,
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

export default addOrder;
