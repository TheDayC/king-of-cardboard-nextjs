import { NextApiRequest, NextApiResponse } from 'next';
import { createTransport } from 'nodemailer';
import AWS from 'aws-sdk';

import { parseAsArrayOfCommerceLayerErrors, parseAsNumber, parseAsString, safelyParse } from '../../../utils/parsers';
import { authClient } from '../../../utils/auth';

const isProd = process.env.NODE_ENV === 'production';
const mailer = isProd ? createTransport({ SES: new AWS.SES() }) : createTransport({ port: 1025 });

async function resetPassword(req: NextApiRequest, res: NextApiResponse): Promise<void> {
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

            const resetToken = safelyParse(
                resetPasswordResponse,
                'data.data.attributes.reset_password_token',
                parseAsString,
                null
            );

            if (resetToken && email) {
                const mailOptions = {
                    from: `No Reply <${process.env.MAILER_ADDRESS}>`,
                    to: email,
                    subject: 'Password Reset - King of Cardboard',
                    text: `Here is your password reset link ${process.env.SITE_URL}/account/resetPassword?token=${resetToken}`,
                };

                await mailer.sendMail(mailOptions);

                res.status(200).json({ hasSent: true });
            }
        } catch (error) {
            const status = safelyParse(error, 'response.status', parseAsNumber, 500);
            const statusText = safelyParse(error, 'response.statusText', parseAsString, 'Error');
            const message = safelyParse(error, 'response.data.errors', parseAsArrayOfCommerceLayerErrors, null);

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

export default resetPassword;
