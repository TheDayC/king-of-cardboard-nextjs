/* eslint-disable @typescript-eslint/no-explicit-any */
import fs from 'fs';
import path from 'path';
import { NextApiRequest, NextApiResponse } from 'next';
import Cors from 'cors';
import sgMail from '@sendgrid/mail';

import { parseAsNumber, parseAsString, safelyParse } from '../../../../utils/parsers';
import { apiErrorHandler } from '../../../../middleware/errors';
import { runMiddleware } from '../../../../middleware/api';
import { parseImgData } from '../../../../utils/webhooks';

// Initializing the cors middleware
const cors = Cors({
    origin: ['https://king-of-cardboard.commercelayer.io/'],
    methods: ['POST', 'HEAD'],
});

// Setup SendGrid's mailer.
sgMail.setApiKey(process.env.SENDGRID_API_KEY || '');

const filePath = path.resolve(process.cwd(), 'html', 'statusChange.html');
const logo = fs.readFileSync(path.resolve(process.cwd(), 'images', 'logo-full.png'));
const status = 'ready';

async function ready(req: NextApiRequest, res: NextApiResponse): Promise<void> {
    if (req.method === 'POST') {
        // Run the middleware
        await runMiddleware(req, res, cors);

        try {
            const orderId = safelyParse(req, 'body.data.relationships.order.data.id', parseAsString, null);
            const shippingAddressId = safelyParse(
                req,
                'body.data.relationships.shipping_address.data.id',
                parseAsString,
                null
            );

            const items: unknown[] | null =
                req.body.included.filter((item: any) => item.type === 'line_items' && item.attributes.sku_code) || null;

            if (items && items.length > 0 && orderId && shippingAddressId) {
                const order = req.body.included.find((item: any) => item.type === 'orders' && item.id === orderId);
                const shippingAddress = req.body.included.find(
                    (item: any) => item.type === 'addresses' && item.id === shippingAddressId
                );

                // Parse some basic customer details
                const firstName = safelyParse(shippingAddress, 'attributes.first_name', parseAsString, '');
                const lastName = safelyParse(shippingAddress, 'attributes.last_name', parseAsString, '');

                // Parse order details
                const email = safelyParse(order, 'attributes.customer_email', parseAsString, '');
                const orderNumber = safelyParse(order, 'attributes.number', parseAsNumber, 0);
                const subTotal = safelyParse(order, 'attributes.formatted_subtotal_amount', parseAsString, '');
                const shipping = safelyParse(order, 'attributes.formatted_shipping_amount', parseAsString, '');
                const total = safelyParse(order, 'attributes.formatted_total_amount_with_taxes', parseAsString, '');

                const itemsHtml = items.map((item) => {
                    const id = safelyParse(item, 'id', parseAsString, '');
                    const name = safelyParse(item, 'attributes.name', parseAsString, '');
                    const sku_code = safelyParse(item, 'attributes.sku_code', parseAsString, '');
                    const quantity = safelyParse(item, 'attributes.sku_code', parseAsNumber, 0);
                    const total = safelyParse(item, 'attributes.formatted_total_amount', parseAsString, '');

                    return `<tr>
                            <td align="center"><img src="cid:${id}" alt="${name} line item image" title="${name} image" class="productImg" /></td>
                            <td>
                                <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                                    <tbody>
                                        <tr>
                                            <td align="center">
                                                <h4 class="itemName">${name}</h4>
                                                <p class="skuCode">${sku_code}</p>
                                                <p class="quantity">Quantity: ${quantity}</p>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </td>
                            <td align="center"><p class="amount">${total}</p></td>
                        </tr>`;
                });
                const itemsText = items.map((item) => {
                    const name = safelyParse(item, 'attributes.name', parseAsString, '');
                    const sku_code = safelyParse(item, 'attributes.sku_code', parseAsString, '');
                    const quantity = safelyParse(item, 'attributes.sku_code', parseAsNumber, 0);

                    return `
                            Name: ${name}
                            SKU: ${sku_code}
                            Quantity: ${quantity}
                        `;
                });

                const itemsImgData = [];

                for (const item of items) {
                    const id = safelyParse(item, 'id', parseAsString, '');
                    const imgUrl = safelyParse(
                        item,
                        'attributes.image_url',
                        parseAsString,
                        'https://via.placeholder.com/50'
                    );
                    const imgData = await parseImgData(id, imgUrl);

                    itemsImgData.push(imgData);
                }

                const htmlData = fs.readFileSync(filePath, 'utf8');
                const html = htmlData
                    .replace('{{name}}', `${firstName}`)
                    .replace('{{orderNumber}}', `${orderNumber}`)
                    .replace('{{items}}', itemsHtml.join(''))
                    .replace('{{subTotal}}', subTotal)
                    .replace('{{shipping}}', shipping)
                    .replace('{{total}}', total)
                    .replace('{{status}}', status);

                const mailOptions = {
                    from: `No Reply <${process.env.MAILER_ADDRESS}>`,
                    to: `${firstName} ${lastName} <${email}>`,
                    subject: `Your King of Cardboard order (#${orderNumber}) has been updated`,
                    html,
                    text: `
                            Hi ${firstName},

                            Your order status has changed!

                            # Order Status Changed
                            The status of your order #${orderNumber} has changed to ${status}!

                            ------
                            
                            ## Items
                            ${itemsText.join('\r\n')}

                            ------

                            Subtotal: ${subTotal}
                            Shipping: ${shipping}
                            Total: ${total}
                        `,
                    attachments: [
                        ...itemsImgData,
                        {
                            type: 'image/png',
                            filename: 'logo.png',
                            content: logo.toString('base64'),
                            content_id: 'logo',
                            disposition: 'inline',
                        },
                    ],
                };

                await sgMail.send(mailOptions);

                res.status(200).end();
            } else {
                res.status(403).json({
                    success: false,
                    message: 'Did not have the required data to send confirmation email.',
                });
            }
        } catch (error) {
            const status = safelyParse(error, 'response.status', parseAsNumber, 500);

            res.status(status).json(apiErrorHandler(error, 'Failed to send order confirmation email.'));
        }
    }
}

export default ready;
