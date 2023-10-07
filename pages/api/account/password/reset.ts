import fs from 'fs';
import path from 'path';
import { NextApiRequest, NextApiResponse } from 'next';
import sgMail from '@sendgrid/mail';
import { DateTime } from 'luxon';
import { nanoid } from 'nanoid';
import { Db } from 'mongodb';
import bcrypt from 'bcrypt';

import { connectToDatabase } from '../../../../middleware/database';
import { parseAsNumber, parseAsString, safelyParse } from '../../../../utils/parsers';
import { hasResetExpired } from '../../../../utils/account';
import { errorHandler } from '../../../../middleware/errors';

// Setup SendGrid's mailer.
sgMail.setApiKey(process.env.SENDGRID_API_KEY || '');

const filePath = path.resolve(process.cwd(), 'html', 'resetPassword.html');
const defaultErr = 'Could not request a password reset.';
const logo = fs.readFileSync(path.resolve(process.cwd(), 'images', 'logo-full.webp'));

// Function to get the reset id from the DB.
async function getResetId(email: string, token: string, db: Db): Promise<string | null> {
    // Find the password reset collection.
    const passwordResetsCollection = db.collection('passwordResets');

    // Find the expiry date.
    const foundReset = await passwordResetsCollection.findOne({ email }, { projection: { expires: 1 } });

    // If found an existing password reset item by email then execute validation.
    if (foundReset) {
        // Grab expiry date.
        const expires = safelyParse(
            foundReset,
            'expires',
            parseAsString,
            DateTime.now().setZone('Europe/London').toISO()
        );

        // Test if current date has exceeded expiry.
        const hasExpired = hasResetExpired(expires);
        if (!hasExpired) return null;
    }

    // If func passes expiry validation then create a new expiry date of 3 mins from now.
    const expires = DateTime.now().setZone('Europe/London').plus({ seconds: 180 }).toISO();

    // Find existing reset item and update with new token, expiry date and add lastReset as null.
    // We'll update last reset in the future incase we require it for checks.
    const resetInsert = await passwordResetsCollection.findOneAndUpdate(
        { email },
        { $set: { token, expires: new Date(expires), lastReset: null } },
        { upsert: true, returnDocument: 'after', projection: { _id: 1 } }
    );

    // Return the id to the main endpoint func.
    return resetInsert.value ? resetInsert.value._id.toString() : null;
}

async function passwordReset(req: NextApiRequest, res: NextApiResponse): Promise<void> {
    if (req.method === 'POST') {
        try {
            // Connect to Mongo and fetch collections.
            const { db } = await connectToDatabase();
            const userCollection = db.collection('users');

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

            // Create a reset token with nanoid
            const resetToken = nanoid();

            // Create a reset id.
            const resetId = await getResetId(email, resetToken, db);

            if (!resetId) {
                res.status(400).json({
                    message: 'Please wait up to 3 minutes before sending another reset link.',
                });

                return Promise.resolve();
            }

            const link = `${process.env.NEXT_PUBLIC_SITE_URL || ''}/resetPassword?token=${resetToken}&email=${email}`;
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
    }

    if (req.method === 'PATCH') {
        try {
            // Connect to Mongo and fetch collections.
            const { db } = await connectToDatabase();
            const passwordResetsCollection = db.collection('passwordResets');
            const usersCollection = db.collection('users');

            // Parse email, token and password then check for errors.
            const email = safelyParse(req, 'body.email', parseAsString, null);
            const token = safelyParse(req, 'body.token', parseAsString, null);
            const password = safelyParse(req, 'body.password', parseAsString, null);

            if (!email || !token || !password) {
                res.status(400).json({
                    message: 'Email, token or password is missing.',
                });

                return Promise.resolve();
            }

            const reset = await passwordResetsCollection.findOne({ email, token }, { projection: { expires: 1 } });
            const expires = safelyParse(reset, 'expires', parseAsString, null);

            if (!reset || !expires) {
                res.status(400).json({
                    message: 'Email, token or password is missing.',
                });

                return Promise.resolve();
            }

            const hasExpired = hasResetExpired(expires);

            if (hasExpired) {
                res.status(400).json({
                    message: 'Reset token has expired, please request a new password reset from the login screen.',
                });

                return Promise.resolve();
            }

            // Encrypt and update the user's password.
            const hashedPassword = await bcrypt.hash(password, process.env.SALT || 10);
            const passwordDoc = await usersCollection.findOneAndUpdate(
                { email },
                { $set: { password: hashedPassword } }
            );

            if (!passwordDoc) {
                res.status(404).json({
                    message: 'Could not find user.',
                });

                return Promise.resolve();
            }

            await passwordResetsCollection.updateOne(
                { _id: reset._id },
                {
                    $set: {
                        expires: null,
                        token: null,
                        lastReset: new Date(DateTime.now().setZone('Europe/London').toISO()),
                    },
                }
            );

            res.status(201).end();
        } catch (err: unknown) {
            const status = safelyParse(err, 'response.status', parseAsNumber, 500);

            res.status(status).json(errorHandler(err, defaultErr));
        }
    }

    return Promise.resolve();
}

export default passwordReset;
