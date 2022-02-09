import fs from 'fs';
import path from 'path';
import { NextApiRequest, NextApiResponse } from 'next';
import { createTransport } from 'nodemailer';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import mandrillTransport from 'nodemailer-mandrill-transport';
import { DateTime } from 'luxon';

import { connectToDatabase } from '../../../middleware/database';
import { parseAsNumber, parseAsString, safelyParse } from '../../../utils/parsers';
import { authClient } from '../../../utils/auth';
import { shouldResetPassword } from '../../../utils/account';
import { errorHandler } from '../../../middleware/errors';

const mailer = createTransport(
    mandrillTransport({
        auth: {
            apiKey: process.env.MANDRILL_API_KEY || '',
        },
    })
);

const filePath = path.resolve(process.cwd(), 'html', 'resetPassword.html');
const defaultErr = 'Could not request a password reset.';

const logo = fs.readFileSync(path.resolve(process.cwd(), 'images', 'logo-full.png'));

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
                const link = `${
                    process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_VERCEL_URL
                }/resetPassword?token=${resetToken}&id=${resetId}&email=${email}`;
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
