import fs from 'fs';
import path from 'path';
import { NextApiRequest, NextApiResponse } from 'next';
import { createTransport } from 'nodemailer';
import { defaultProvider } from '@aws-sdk/credential-provider-node';
import * as aws from '@aws-sdk/client-ses';
import { DateTime } from 'luxon';

import { connectToDatabase } from '../../../middleware/database';
import { parseAsNumber, parseAsString, safelyParse } from '../../../utils/parsers';
import { authClient } from '../../../utils/auth';
import { shouldResetPassword } from '../../../utils/account';
import { errorHandler } from '../../../middleware/errors';

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
const defaultErr = 'Could not request a password reset.';

async function requestPasswordReset(req: NextApiRequest, res: NextApiResponse): Promise<void> {
    if (req.method === 'POST') {
        const { db } = await connectToDatabase();
        const token = safelyParse(req, 'body.token', parseAsString, null);
        const email = safelyParse(req, 'body.email', parseAsString, null);
        const cl = authClient(token);
        const passwordResetsCollection = db.collection('passwordResets');

        try {
            const resetRequest = await passwordResetsCollection.findOne({ emailAddress: email });
            const shouldReset = resetRequest
                ? shouldResetPassword(DateTime.fromISO(resetRequest.lastSent, { zone: 'Europe/London' }))
                : true;

            if (!shouldReset) {
                res.status(403).json({
                    status: 403,
                    message: 'Forbidden',
                    description: 'You have recently requested a password reset, please try again later.',
                });
                return Promise.resolve();
            }

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
                const link = `${process.env.NEXT_PUBLIC_SITE_URL}/resetPassword?token=${resetToken}&id=${resetId}&email=${email}`;
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

                // Choose whether to update or insert depending on if a reset request was found.
                const lastSent = DateTime.now().setZone('Europe/London').toISO();

                if (resetRequest) {
                    const values = {
                        $set: {
                            lastSent,
                        },
                    };

                    await passwordResetsCollection.updateOne({ emailAddress: email }, values);
                } else {
                    const document = {
                        emailAddress: email,
                        lastSent,
                    };

                    await passwordResetsCollection.insertOne(document);
                }

                res.status(200).json({ hasSent: true });
            }
        } catch (err: unknown) {
            const status = safelyParse(err, 'response.status', parseAsNumber, 500);

            res.status(status).json(errorHandler(err, defaultErr));
        }

        return Promise.resolve();
    }
}

export default requestPasswordReset;
