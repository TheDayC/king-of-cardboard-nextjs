import fs from 'fs';
import path from 'path';
import { NextApiRequest, NextApiResponse } from 'next';
import { createTransport } from 'nodemailer';
import { defaultProvider } from '@aws-sdk/credential-provider-node';
import * as aws from '@aws-sdk/client-ses';

import {
    parseAsArrayOfCommerceLayerErrors,
    parseAsArrayOfItems,
    parseAsCustomerDetails,
    parseAsNumber,
    parseAsOrder,
    parseAsString,
    safelyParse,
} from '../../utils/parsers';

const ses = new aws.SES({
    apiVersion: '2010-12-01',
    region: process.env.AWS_REGION,
    credentialDefaultProvider: defaultProvider,
});

const mailer = createTransport({
    SES: { ses, aws },
    sendingRate: 1, // max 1 messages/second
});

const filePath = path.resolve(process.cwd(), 'html', 'order.html');

async function sendOrderConfirmation(req: NextApiRequest, res: NextApiResponse): Promise<void> {
    if (req.method === 'POST') {
        try {
            const order = safelyParse(req, 'body.order', parseAsOrder, null);
            const items = safelyParse(req, 'body.items', parseAsArrayOfItems, null);
            const customerDetails = safelyParse(req, 'body.customerDetails', parseAsCustomerDetails, null);

            if (order && items && customerDetails) {
                try {
                    const {
                        firstName,
                        lastName,
                        addressLineOne,
                        addressLineTwo,
                        city,
                        postcode,
                        county,
                        phone,
                        email,
                        shippingAddressLineOne,
                        shippingAddressLineTwo,
                        shippingCity,
                        shippingCounty,
                        shippingPostcode,
                    } = customerDetails;
                    const {
                        formatted_shipping_amount: shipping,
                        formatted_subtotal_amount: subTotal,
                        formatted_total_amount_with_taxes: total,
                    } = order;
                    const itemsHtml = items.map(
                        (item) =>
                            `<tr>
                            <td><img src="cid:${item.id}" alt="${item.name} line item image" title="${item.name} image" /></td>
                            <td>
                                <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                                    <tbody>
                                        <tr>
                                            <td align="left">
                                                <h4 class="itemName">${item.name}</h4>
                                                <p class="skuCode">${item.sku_code}</p>
                                                <p class="quantity">Quantity: ${item.quantity}</p>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </td>
                            <td><p class="amount">${item.formatted_total_amount}</p></td>
                        </tr>`
                    );
                    const itemsText = items.map(
                        (item) =>
                            `
                            Name: ${item.name}
                            SKU: ${item.sku_code}
                            Quantity: ${item.quantity}
                        `
                    );
                    const itemsImgData = items.map((item) => ({
                        filename: item.name,
                        path: item.image_url.length > 0 ? item.image_url : 'https://via.placeholder.com/50',
                        cid: item.id, //same cid value as in the html img src
                    }));
                    console.log(
                        '🚀 ~ file: sendOrderConfirmation.ts ~ line 67 ~ sendOrderConfirmation ~ itemsImgData',
                        itemsImgData
                    );
                    const htmlData = fs.readFileSync(filePath, 'utf8');
                    const html = htmlData
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
                        attachments: [
                            ...itemsImgData,
                            {
                                filename: 'logo-full.png',
                                path: path.resolve(process.cwd(), 'images', 'logo-full.png'),
                                cid: 'logo', //same cid value as in the html img src
                            },
                        ],
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
                res.status(403).json({ success: false, message: 'Passwords do not match' });
            }
        } catch (err) {
            if (err) throw err;
        }
    }
}

export default sendOrderConfirmation;