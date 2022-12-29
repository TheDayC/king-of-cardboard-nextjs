import fs from 'fs';
import path from 'path';
import { NextApiRequest, NextApiResponse } from 'next';
import sgMail from '@sendgrid/mail';
import { DateTime } from 'luxon';
import { nanoid } from 'nanoid';
import { Db } from 'mongodb';

import { connectToDatabase } from '../../../middleware/database';
import { parseAsNumber, parseAsString, safelyParse } from '../../../utils/parsers';
import { shouldResetPassword } from '../../../utils/account';
import { errorHandler } from '../../../middleware/errors';

// Setup SendGrid's mailer.
sgMail.setApiKey(process.env.SENDGRID_API_KEY || '');

const filePath = path.resolve(process.cwd(), 'html', 'resetPassword.html');
const defaultErr = 'Could not request a password reset.';
const logo = fs.readFileSync(path.resolve(process.cwd(), 'images', 'logo-full.png'));

async function getResetId(email: string, token: string, db: Db): Promise<string | null> {
    const passwordResetsCollection = db.collection('passwordResets');
    const foundReset = await passwordResetsCollection.findOne({ email });
    const newDate = DateTime.now().setZone('Europe/London');
    const expires = newDate.plus({ seconds: 180 });

    if (foundReset) {
        const shouldReset = shouldResetPassword(DateTime.fromISO(foundReset.lastSent, { zone: 'Europe/London' }));

        if (!shouldReset) return null;
    }

    const resetInsert = await passwordResetsCollection.findOneAndUpdate(
        { email },
        { $set: { token, lastSent: newDate.toISO(), expires: expires.toISO() } },
        { upsert: true, returnDocument: 'after', projection: { _id: 1 } }
    );

    return resetInsert.value ? resetInsert.value._id.toString() : null;
}

async function requestPasswordReset(req: NextApiRequest, res: NextApiResponse): Promise<void> {
    if (req.method === 'POST') {
        try {
            // Connect to Mongo and fetch collections.
            const { db } = await connectToDatabase();
            const userCollection = db.collection('users');
            const passwordResetsCollection = db.collection('passwordResets');

            // Parse email and check for errors.
            const email = safelyParse(req, 'body.email', parseAsString, null);

            if (!email) {
                res.status(404).json({
                    message: 'Please provide a valid email.',
                });

                return Promise.resolve();
            }

            // Find user and parse password.
            const user = await userCollection.findOne({ email }, { projection: { password: 1 } });
            const password = safelyParse(user, 'password', parseAsString, null);

            if (!password) {
                res.status(404).json({
                    message: 'There is no password associated with your account, did you use OAuth?',
                });

                return Promise.resolve();
            }

            // Check for an existing request, if it exists check the time last requested.
            //const foundReset = await passwordResetsCollection.findOneAndUpdate({ email }, {}, {upsert: true});

            // Create a reset token with nanoid
            const resetToken = nanoid();
            const resetId = await getResetId(email, resetToken, db);

            if (!resetId) {
                res.status(400).json({
                    message: 'Please wait up to 3 minutes before sending another reset link.',
                });

                return Promise.resolve();
            }

            const link = `${
                process.env.NEXT_PUBLIC_SITE_URL || ''
            }/resetPassword?token=${resetToken}&id=${resetId}&email=${email}`;
            const htmlData = fs.readFileSync(filePath, 'utf8');
            const html = htmlData
                .replace('{{email}}', email)
                .replace('{{link}}', `<a href="${link}" target="_blank">Reset Password</a>`);

            const mailOptions = {
                from: `No Reply <${process.env.MAILER_ADDRESS || ''}>`,
                to: email,
                subject: 'Password Reset - King of Cardboard',
                html,
                text: `Hi ${email}, it looks like you've requested a password reset and are looking at the raw version of our email. Please copy and paste the following link into your browser's address bar: ${link}`,
                attachments: [
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

            res.status(201).end();
        } catch (err: unknown) {
            const status = safelyParse(err, 'response.status', parseAsNumber, 500);

            res.status(status).json(errorHandler(err, defaultErr));
        }

        return Promise.resolve();
    }
}

export default requestPasswordReset;
