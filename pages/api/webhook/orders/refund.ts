/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/ban-ts-comment */
import fs from 'fs';
import path from 'path';
import { NextApiRequest, NextApiResponse } from 'next';
import Cors from 'cors';
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

const filePath = path.resolve(process.cwd(), 'html', 'refund.html');
const logo = fs.readFileSync(path.resolve(process.cwd(), 'images', 'logo-full.png'));

async function refund(req: NextApiRequest, res: NextApiResponse): Promise<void> {
    if (req.method === 'POST') {
        // Run the middleware
        await runMiddleware(req, res, cors);

        try {
            const orderNumber = safelyParse(req, 'body.data.attributes.number', parseAsNumber, 0);
            const email = safelyParse(req, 'body.data.attributes.customer_email', parseAsString, '');

            const refundId = req.body.data.relationships.refunds.data[0].id;

            const shippingAddressId = safelyParse(
                req,
                'body.data.relationships.shipping_address.data.id',
                parseAsString,
                null
            );

            if (refundId) {
                const refund = req.body.included.find((item: any) => item.type === 'refunds' && item.id === refundId);
                const shippingAddress = req.body.included.find(
                    (item: any) => item.type === 'addresses' && item.id === shippingAddressId
                );

                // Parse some basic customer details
                const firstName = safelyParse(shippingAddress, 'attributes.first_name', parseAsString, '');
                const lastName = safelyParse(shippingAddress, 'attributes.last_name', parseAsString, '');

                // Parse refund data
                const refundedAmount = safelyParse(refund, 'attributes.formatted_amount', parseAsString, '');

                const htmlData = fs.readFileSync(filePath, 'utf8');
                const html = htmlData
                    .replace('{{name}}', `${firstName}`)
                    .replace('{{orderNumber}}', `${orderNumber}`)
                    .replace('{{refunded}}', refundedAmount);

                const mailOptions = {
                    from: `No Reply <${process.env.MAILER_ADDRESS}>`,
                    to: `${firstName} ${lastName} <${email}>`,
                    subject: 'Order Refunded - King of Cardboard',
                    html,
                    text: `
                           Hi ${firstName},

                            Your order has been refunded!

                            ------

                            Amount refunded: ${refundedAmount}
                        `,
                    mandrillOptions: {
                        message: {
                            images: [
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
            console.log('🚀 ~ file: approveOrder.ts ~ line 254 ~ approveOrder ~ error', error);
            const status = safelyParse(error, 'response.status', parseAsNumber, 500);

            res.status(status).json(apiErrorHandler(error, 'Failed to send order confirmation email.'));
        }
    }
}

export default refund;
