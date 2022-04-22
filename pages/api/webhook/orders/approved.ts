/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/ban-ts-comment */
import fs from 'fs';
import path from 'path';
import imageType from 'image-type';
import { NextApiRequest, NextApiResponse } from 'next';
import Cors from 'cors';
import axios from 'axios';
import { createTransport } from 'nodemailer';
// @ts-ignore
import mandrillTransport from 'nodemailer-mandrill-transport';

import { parseAsNumber, parseAsString, safelyParse } from '../../../../utils/parsers';
import { apiErrorHandler } from '../../../../middleware/errors';
import { runMiddleware } from '../../../../middleware/api';

// Initializing the cors middleware
const cors = Cors({
    origin: ['https://king-of-cardboard.commercelayer.io/'],
    methods: ['POST', 'HEAD'],
});

const mailer = createTransport(
    mandrillTransport({
        auth: {
            apiKey: process.env.MANDRILL_API_KEY,
        },
    })
);

interface ImageObject {
    type: string;
    name: string;
    content: string;
}

async function parseImgData(name: string, url: string): Promise<ImageObject> {
    const res = await axios.get(url, { responseType: 'arraybuffer' });

    // @ts-ignore
    const content = Buffer.from(res.data, 'binary').toString('base64');

    // @ts-ignore
    const type = imageType(res.data);

    return {
        type: type ? type.mime : '',
        name,
        content,
    };
}

const filePath = path.resolve(process.cwd(), 'html', 'order.html');
const logo = fs.readFileSync(path.resolve(process.cwd(), 'images', 'logo-full.png'));

async function approved(req: NextApiRequest, res: NextApiResponse): Promise<void> {
    if (req.method === 'POST') {
        // Run the middleware
        await runMiddleware(req, res, cors);

        try {
            const orderNumber = safelyParse(req, 'body.data.attributes.number', parseAsNumber, 0);
            const subTotal = safelyParse(req, 'body.data.attributes.formatted_subtotal_amount', parseAsString, '');
            const shipping = safelyParse(req, 'body.data.attributes.formatted_shipping_amount', parseAsString, '');
            const total = safelyParse(req, 'body.data.attributes.formatted_total_amount_with_taxes', parseAsString, '');
            const email = safelyParse(req, 'body.data.attributes.customer_email', parseAsString, '');
            const billingAddressId = safelyParse(
                req,
                'body.data.relationships.billing_address.data.id',
                parseAsString,
                null
            );
            const shippingAddressId = safelyParse(
                req,
                'body.data.relationships.shipping_address.data.id',
                parseAsString,
                null
            );

            const items: unknown[] | null =
                req.body.included.filter((item: any) => item.type === 'line_items' && item.attributes.sku_code) || null;

            if (items && items.length > 0 && billingAddressId && shippingAddressId) {
                // Find addresses
                const billingAddress = req.body.included.find(
                    (item: any) => item.type === 'addresses' && item.id === billingAddressId
                );
                const shippingAddress = req.body.included.find(
                    (item: any) => item.type === 'addresses' && item.id === shippingAddressId
                );

                // Parse some basic customer details
                const firstName = safelyParse(shippingAddress, 'attributes.first_name', parseAsString, '');
                const lastName = safelyParse(shippingAddress, 'attributes.last_name', parseAsString, '');
                const phone = safelyParse(shippingAddress, 'attributes.phone', parseAsString, '');

                // Parse billing address
                const addressLineOne = safelyParse(billingAddress, 'attributes.line_1', parseAsString, '');
                const addressLineTwo = safelyParse(billingAddress, 'attributes.line_1', parseAsString, '');
                const city = safelyParse(billingAddress, 'attributes.city', parseAsString, '');
                const postcode = safelyParse(billingAddress, 'attributes.zip_code', parseAsString, '');
                const county = safelyParse(billingAddress, 'attributes.state_code', parseAsString, '');

                // Parse shipping address
                const shippingAddressLineOne = safelyParse(shippingAddress, 'attributes.line_1', parseAsString, '');
                const shippingAddressLineTwo = safelyParse(shippingAddress, 'attributes.line_1', parseAsString, '');
                const shippingCity = safelyParse(shippingAddress, 'attributes.city', parseAsString, '');
                const shippingPostcode = safelyParse(shippingAddress, 'attributes.zip_code', parseAsString, '');
                const shippingCounty = safelyParse(shippingAddress, 'attributes.state_code', parseAsString, '');

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

                const itemsImgData: ImageObject[] = [];

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
                    .replace('{{orderNumber}}', `${orderNumber}`)
                    .replace('{{name}}', firstName)
                    .replace('{{email}}', email)
                    .replace('{{firstName}}', firstName)
                    .replace('{{lastName}}', lastName)
                    .replace('{{phone}}', phone)
                    .replace('{{lineOne}}', addressLineOne)
                    .replace('{{lineTwo}}', addressLineTwo)
                    .replace('{{city}}', city)
                    .replace('{{postcode}}', postcode)
                    .replace('{{county}}', county)
                    .replace('{{shippingLineOne}}', shippingAddressLineOne)
                    .replace('{{shippingLineTwo}}', shippingAddressLineTwo)
                    .replace('{{shippingCity}}', shippingCity)
                    .replace('{{shippingPostcode}}', shippingPostcode)
                    .replace('{{shippingCounty}}', shippingCounty)
                    .replace('{{items}}', itemsHtml.join(''))
                    .replace('{{subTotal}}', subTotal)
                    .replace('{{shipping}}', shipping)
                    .replace('{{total}}', total);

                const mailOptions = {
                    from: `No Reply <${process.env.MAILER_ADDRESS}>`,
                    to: `${firstName} ${lastName} <${email}>`,
                    subject: 'Order Confirmation - King of Cardboard',
                    html,
                    text: `
                            Hi ${firstName},

                            Thank you for placing your order with King of Cardboard, we hope you enjoy the products you've bought!
                            Below you'll find a summary of your order, you can also review these details by logging into your account on the website and using the account menu to navigate to your order history.
                        
                            # Order Details
                            ------
                            ## Personal Details
                            Name: ${firstName} ${lastName}
                            Email: ${email}
                            Phone: ${phone}

                            ------

                            ### Billing Details 
                            ${addressLineOne}
                            ${addressLineTwo}
                            ${city}
                            ${postcode}
                            ${county}

                            ------
                            
                            ### Shipping Details
                            ${shippingAddressLineOne}
                            ${shippingAddressLineTwo}
                            ${shippingCity}
                            ${shippingPostcode}
                            ${shippingCounty}

                            ------
                            
                            ## Items
                            ${itemsText.join('\r\n')}

                            ------

                            Subtotal: ${subTotal}
                            Shipping: ${shipping}
                            Total: ${total}
                        `,
                    mandrillOptions: {
                        message: {
                            images: [
                                ...itemsImgData,
                                {
                                    type: 'image/png',
                                    name: 'logo',
                                    content: logo.toString('base64'),
                                },
                            ],
                        },
                    },
                };

                await mailer.sendMail(mailOptions);

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

export default approved;
