import fs from 'fs';
import path from 'path';
import { NextApiRequest, NextApiResponse } from 'next';
import { createTransport } from 'nodemailer';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import mandrillTransport from 'nodemailer-mandrill-transport';

import {
    parseAsArrayOfCommerceLayerErrors,
    parseAsArrayOfItems,
    parseAsCustomerAddress,
    parseAsCustomerDetails,
    parseAsNumber,
    parseAsString,
    safelyParse,
} from '../../utils/parsers';
import { apiErrorHandler } from '../../middleware/errors';

const mailer = createTransport(
    mandrillTransport({
        auth: {
            apiKey: process.env.MANDRILL_API_KEY || '',
        },
    })
);

const filePath = path.resolve(process.cwd(), 'html', 'order.html');
const logo = fs.readFileSync(path.resolve(process.cwd(), 'images', 'logo-full.png'));

async function sendOrderConfirmation(req: NextApiRequest, res: NextApiResponse): Promise<void> {
    if (req.method === 'POST') {
        try {
            const orderNumber = safelyParse(req, 'body.orderNumber', parseAsNumber, 0);
            const subTotal = safelyParse(req, 'body.subTotal', parseAsString, '');
            const shipping = safelyParse(req, 'body.shipping', parseAsString, '');
            const total = safelyParse(req, 'body.total', parseAsString, '');
            const items = safelyParse(req, 'body.items', parseAsArrayOfItems, null);
            const customerDetails = safelyParse(req, 'body.customerDetails', parseAsCustomerDetails, null);
            const billingAddress = safelyParse(req, 'body.billingAddress', parseAsCustomerAddress, null);
            const shippingAddress = safelyParse(req, 'body.shippingAddress', parseAsCustomerAddress, null);

            if (items && customerDetails && billingAddress && shippingAddress) {
                try {
                    const { first_name: firstName, last_name: lastName, phone, email } = customerDetails;
                    const {
                        line_1: addressLineOne,
                        line_2: addressLineTwo,
                        city,
                        zip_code: postcode,
                        state_code: county,
                    } = billingAddress;
                    const {
                        line_1: shippingAddressLineOne,
                        line_2: shippingAddressLineTwo,
                        city: shippingCity,
                        zip_code: shippingPostcode,
                        state_code: shippingCounty,
                    } = shippingAddress;
                    const itemsHtml = items.map(
                        (item) =>
                            `<tr>
                            <td align="center"><img src="cid:${item.id}" alt="${item.name} line item image" title="${item.name} image" class="productImg" /></td>
                            <td>
                                <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                                    <tbody>
                                        <tr>
                                            <td align="center">
                                                <h4 class="itemName">${item.name}</h4>
                                                <p class="skuCode">${item.sku_code}</p>
                                                <p class="quantity">Quantity: ${item.quantity}</p>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </td>
                            <td align="center"><p class="amount">${item.formatted_total_amount}</p></td>
                        </tr>`
                    );
                    const itemsText = items.map(
                        (item) => `
                            Name: ${item.name}
                            SKU: ${item.sku_code}
                            Quantity: ${item.quantity}
                        `
                    );
                    const itemsImgData = items.map((item) => {
                        const imgUrl = item.image.url.length > 0 ? item.image.url : 'https://via.placeholder.com/50';
                        const img = fs.readFileSync(path.resolve(imgUrl));
                        const type = imgUrl.split('.').pop();

                        return {
                            type: `image/${type}`,
                            name: item.id,
                            content: img.toString('base64'),
                        };
                    });
                    const htmlData = fs.readFileSync(filePath, 'utf8');
                    const html = htmlData
                        .replace('{{orderNumber}}', `${orderNumber}`)
                        .replace('{{name}}', firstName || '')
                        .replace('{{email}}', email || '')
                        .replace('{{firstName}}', firstName || '')
                        .replace('{{lastName}}', lastName || '')
                        .replace('{{phone}}', phone || '')
                        .replace('{{lineOne}}', addressLineOne || '')
                        .replace('{{lineTwo}}', addressLineTwo || '')
                        .replace('{{city}}', city || '')
                        .replace('{{postcode}}', postcode || '')
                        .replace('{{county}}', county || '')
                        .replace('{{shippingLineOne}}', shippingAddressLineOne || '')
                        .replace('{{shippingLineTwo}}', shippingAddressLineTwo || '')
                        .replace('{{shippingCity}}', shippingCity || '')
                        .replace('{{shippingPostcode}}', shippingPostcode || '')
                        .replace('{{shippingCounty}}', shippingCounty || '')
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
                        ses: {
                            // optional extra arguments for SendRawEmail
                            Tags: [
                                {
                                    Name: 'order_confirmation',
                                    Value: 'order_confirmation_value',
                                },
                            ],
                        },
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

                    res.status(200).json({ success: true });
                } catch (error) {
                    const status = safelyParse(error, 'response.status', parseAsNumber, 500);
                    const statusText = safelyParse(error, 'response.statusText', parseAsString, 'Error');
                    const message = safelyParse(error, 'response.data.errors', parseAsArrayOfCommerceLayerErrors, null);

                    res.status(status).json({ status, statusText, message: message ? message[0].detail : 'Error' });
                }
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

export default sendOrderConfirmation;
