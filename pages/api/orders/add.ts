import fs from 'fs';
import path from 'path';
import { DateTime } from 'luxon';
import { ObjectId } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';
import sgMail, { MailDataRequired } from '@sendgrid/mail';

import { Fulfillment, Payment, Status } from '../../../enums/orders';
import { connectToDatabase } from '../../../middleware/database';
import { errorHandler } from '../../../middleware/errors';
import { CartItem } from '../../../types/cart';
import { parseAsNumber, parseAsString, safelyParse } from '../../../utils/parsers';
import { AttachmentData } from '../../../types/webhooks';
import { parseImgData } from '../../../utils/webhooks';
import { Address, CustomerDetails } from '../../../types/checkout';
import { getPrettyPrice } from '../../../utils/account/products';
import { formatOrderNumber } from '../../../utils/checkout';

const defaultErr = 'Order could not be added.';
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
const filePath = path.resolve(process.cwd(), 'html', 'order.html');
const logo = fs.readFileSync(path.resolve(process.cwd(), 'images', 'logo-full.png'));

sgMail.setApiKey(process.env.SENDGRID_API_KEY || '');

function createItemsHTML(items: CartItem[]): string[] {
    return items.map(({ _id, title, sku, quantity, price }) => {
        return `<tr>
                <td align="center"><img src="cid:${_id}" alt="${title} line item image" title="${title} image" class="productImg" /></td>
                <td>
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                        <tbody>
                            <tr>
                                <td align="center">
                                    <h4 class="itemName">${title}</h4>
                                    <p class="skuCode">${sku}</p>
                                    <p class="quantity">Quantity: ${quantity}</p>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </td>
                <td align="center"><p class="amount">${getPrettyPrice(price * quantity)}</p></td>
            </tr>`;
    });
}

function createItemsText(items: CartItem[]): string[] {
    return items.map(({ title, sku, quantity, price }) => {
        return `
            Name: ${title}
            SKU: ${sku}
            Quantity: ${quantity}
            Total: ${getPrettyPrice(price * quantity)}
        `;
    });
}

async function createImageData(items: CartItem[]): Promise<AttachmentData[]> {
    const itemsImgData: AttachmentData[] = [];

    for (const item of items) {
        const imgData = await parseImgData(item._id, item.mainImage.url);

        itemsImgData.push(imgData);
    }

    return itemsImgData;
}

function createHTML(
    orderNumber: number,
    customerDetails: CustomerDetails,
    billingAddress: Address,
    shippingAddress: Address,
    items: CartItem[],
    subTotal: number,
    shipping: number,
    discount: number,
    total: number
): string {
    const htmlData = fs.readFileSync(filePath, 'utf8');
    const itemsHtml = createItemsHTML(items);

    return htmlData
        .replace('{{orderNumber}}', `${formatOrderNumber(orderNumber)}`)
        .replace('{{name}}', `${customerDetails.firstName} ${customerDetails.lastName}`)
        .replace('{{email}}', customerDetails.email)
        .replace('{{firstName}}', customerDetails.firstName)
        .replace('{{lastName}}', customerDetails.lastName)
        .replace('{{phone}}', customerDetails.phone || '')
        .replace('{{lineOne}}', billingAddress.lineOne)
        .replace('{{lineTwo}}', billingAddress.lineTwo)
        .replace('{{city}}', billingAddress.city)
        .replace('{{postcode}}', billingAddress.postcode)
        .replace('{{county}}', billingAddress.county)
        .replace('{{shippingLineOne}}', shippingAddress.lineOne)
        .replace('{{shippingLineTwo}}', shippingAddress.lineTwo)
        .replace('{{shippingCity}}', shippingAddress.city)
        .replace('{{shippingPostcode}}', shippingAddress.postcode)
        .replace('{{shippingCounty}}', shippingAddress.county)
        .replace('{{items}}', itemsHtml.join(''))
        .replace('{{subTotal}}', getPrettyPrice(subTotal))
        .replace('{{discount}}', getPrettyPrice(discount))
        .replace('{{shipping}}', getPrettyPrice(shipping))
        .replace('{{total}}', getPrettyPrice(total));
}

function createText(
    name: string,
    customerDetails: CustomerDetails,
    billingAddress: Address,
    shippingAddress: Address,
    items: CartItem[],
    subTotal: number,
    shipping: number,
    discount: number,
    total: number,
    isNotification: boolean
): string {
    const itemsText = createItemsText(items);

    const bodyText = isNotification
        ? `
    The order below has been placed, ensure to fulfill. 
    `
        : `
    Thank you for placing your order with King of Cardboard, we hope you enjoy the products you've bought!
    Below you'll find a summary of your order, you can also review these details by logging into your account on the website and using the account menu to navigate to your order history.`;

    return `
        Hi ${name},

        ${bodyText}
        
        # Order Details
        ------
        ## Personal Details
        Name: ${customerDetails.firstName} ${customerDetails.lastName}
        Email: ${customerDetails.email}
        Phone: ${customerDetails.phone}

        ------

        ### Billing Details 
        ${billingAddress.lineOne}
        ${billingAddress.lineTwo}
        ${billingAddress.city}
        ${billingAddress.postcode}
        ${billingAddress.county}

        ------
        
        ### Shipping Details
        ${shippingAddress.lineOne}
        ${shippingAddress.lineTwo}
        ${shippingAddress.city}
        ${shippingAddress.postcode}
        ${shippingAddress.county}

        ------
        
        ## Items
        ${itemsText.join('\r\n')}

        ------

        Subtotal: ${subTotal}
        Discount: ${discount}
        Shipping: ${shipping}
        Total: ${total}
    `;
}

function createMailerOptions(
    orderNumber: number,
    name: string,
    email: string,
    customerDetails: CustomerDetails,
    billingAddress: Address,
    shippingAddress: Address,
    items: CartItem[],
    itemImageData: AttachmentData[],
    subTotal: number,
    shipping: number,
    discount: number,
    total: number,
    isNotification: boolean
): MailDataRequired {
    return {
        to: email,
        from: process.env.MAILER_ADDRESS || 'noreply@kingofcardboard.co.uk',
        subject: `${isNotification ? 'Order Confirmation' : 'Order Placed'} - King of Cardboard`,
        html: createHTML(
            orderNumber,
            customerDetails,
            billingAddress,
            shippingAddress,
            items,
            subTotal,
            shipping,
            discount,
            total
        ),
        text: createText(
            name,
            customerDetails,
            billingAddress,
            shippingAddress,
            items,
            subTotal,
            shipping,
            discount,
            total,
            isNotification
        ),
        attachments: [
            ...itemImageData,
            {
                type: 'image/png',
                filename: 'logo.png',
                content: logo.toString('base64'),
                content_id: 'logo',
                disposition: 'inline',
            },
        ],
    };
}

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
            const items: CartItem[] = req.body.items || [];
            const userId = safelyParse(req, 'body.userId', parseAsString, null);
            const subTotal = safelyParse(req, 'body.subTotal', parseAsNumber, 0);
            const shipping = safelyParse(req, 'body.shipping', parseAsNumber, 0);
            const discount = safelyParse(req, 'body.discount', parseAsNumber, 0);
            const total = safelyParse(req, 'body.total', parseAsNumber, 0);
            const customerDetails = req.body.customerDetails as CustomerDetails;
            const shippingAddress = req.body.shippingAddress as Address;
            const billingAddress = req.body.billingAddress as Address;
            const paymentId = safelyParse(req, 'body.paymentId', parseAsString, null);
            const paymentMethod = safelyParse(req, 'body.paymentMethod', parseAsNumber, null);

            const { insertedId } = await collection.insertOne({
                userId,
                email,
                orderStatus,
                paymentStatus,
                fulfillmentStatus,
                items,
                created: currentDate.toISO(),
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
                discount,
                shipping,
                total,
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
