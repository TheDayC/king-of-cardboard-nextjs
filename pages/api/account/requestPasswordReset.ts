import fs from 'fs';
import path from 'path';
import { NextApiRequest, NextApiResponse } from 'next';
import { createTransport } from 'nodemailer';
import { defaultProvider } from '@aws-sdk/credential-provider-node';
import * as aws from '@aws-sdk/client-ses';

import { parseAsArrayOfCommerceLayerErrors, parseAsNumber, parseAsString, safelyParse } from '../../../utils/parsers';
import { authClient } from '../../../utils/auth';

const ses = new aws.SES({
    apiVersion: '2010-12-01',
    region: process.env.AWS_REGION,
    credentialDefaultProvider: defaultProvider,
});

const mailer = createTransport({
    SES: { ses, aws },
    sendingRate: 1, // max 1 messages/second
});

const filePath = path.resolve(process.cwd(), 'html', 'resetPassword.html');

async function requestPasswordReset(req: NextApiRequest, res: NextApiResponse): Promise<void> {
    if (req.method === 'POST') {
        const token = safelyParse(req, 'body.token', parseAsString, null);
        const email = safelyParse(req, 'body.email', parseAsString, null);
        const cl = authClient(token);

        try {
            const resetPasswordResponse = await cl.post('/api/customer_password_resets', {
                data: {
                    type: 'customer_password_resets',
                    attributes: {
                        customer_email: email,
                    },
                },
            });

            const resetId = safelyParse(resetPasswordResponse, 'data.data.id', parseAsString, null);

            const resetToken = safelyParse(
                resetPasswordResponse,
                'data.data.attributes.reset_password_token',
                parseAsString,
                null
            );

            if (resetToken && email) {
                const link = `${process.env.SITE_URL}/resetPassword?token=${resetToken}&id=${resetId}&email=${email}`;
                const htmlData = fs.readFileSync(filePath, 'utf8');
                const html = htmlData
                    .replace('{{email}}', email)
                    .replace('{{link}}', `<a href="${link}" target="_blank">Reset Password</a>`);

                const mailOptions = {
                    from: `No Reply <${process.env.MAILER_ADDRESS}>`,
                    to: email,
                    subject: 'Password Reset - King of Cardboard',
                    html,
                    text: `Hi ${email}, it looks like you've requested a password reset and are looking at the raw version of our email. Please copy and paste the following link into your browser's address bar: ${link}`,
                    ses: {
                        // optional extra arguments for SendRawEmail
                        Tags: [
                            {
                                Name: 'reset_password',
                                Value: 'reset_password_value',
                            },
                        ],
                    },
                    attachments: [
                        {
                            filename: 'logo-full.png',
                            path: path.resolve(process.cwd(), 'images', 'logo-full.png'),
                            cid: 'logo', //same cid value as in the html img src
                        },
                    ],
                };

                await mailer.sendMail(mailOptions);

                res.status(200).json({ hasSent: true });
            }
        } catch (error) {
            console.log('🚀 ~ file: requestPasswordReset.ts ~ line 76 ~ requestPasswordReset ~ error', error);
            const status = safelyParse(error, 'response.status', parseAsNumber, 500);
            const statusText = safelyParse(error, 'response.statusText', parseAsString, 'Error');
            const message = safelyParse(error, 'response.data.errors', parseAsArrayOfCommerceLayerErrors, [
                'We could not send you a password reset email.',
            ]);

            res.status(status).json({ status, statusText, message });
        }

        return Promise.resolve();
    }

    // If the user hits this endpoint via a get request
    if (req.method === 'GET') {
        const token = safelyParse(req, 'query.token', parseAsString, null);

        res.status(200).json({ token });
    }
}

export default requestPasswordReset;
