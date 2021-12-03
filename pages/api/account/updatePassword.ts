import { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcrypt';

import { connectToDatabase } from '../../../middleware/database';
import { parseAsArrayOfCommerceLayerErrors, parseAsNumber, parseAsString, safelyParse } from '../../../utils/parsers';
import { authClient } from '../../../utils/auth';

async function updatePassword(req: NextApiRequest, res: NextApiResponse): Promise<void> {
    if (req.method === 'POST') {
        const { db, client } = await connectToDatabase();

        try {
            const emailAddress = safelyParse(req, 'body.emailAddress', parseAsString, '');
            const password = safelyParse(req, 'body.password', parseAsString, null);
            const confirmPassword = safelyParse(req, 'body.confirmPassword', parseAsString, null);
            const token = safelyParse(req, 'body.token', parseAsString, null);

            const credsCollection = db.collection('credentials');
            const creds = await credsCollection.findOne({ emailAddress });
            const passwordsMatch = password === confirmPassword;
            const cl = authClient(token);

            if (creds && password && passwordsMatch) {
                const hash = await bcrypt.hash(password, parseInt(process.env.SALT_ROUNDS || '1'));

                if (hash) {
                    // Set new values to update in collection.
                    const values = {
                        $set: {
                            password: hash,
                        },
                    };

                    // Update document in collection.
                    const updatedCreds = await credsCollection.updateOne({ emailAddress }, values);

                    try {
                        await cl.patch(`/api/customers/${creds.commerceId}`, {
                            data: {
                                type: 'customers',
                                id: creds.commerceId,
                                attributes: {
                                    password,
                                },
                            },
                        });

                        res.status(200).json({ success: true, data: updatedCreds });
                    } catch (error) {
                        const status = safelyParse(error, 'response.status', parseAsNumber, 500);
                        const statusText = safelyParse(error, 'response.statusText', parseAsString, 'Error');
                        const message = safelyParse(
                            error,
                            'response.data.errors',
                            parseAsArrayOfCommerceLayerErrors,
                            null
                        );

                        res.status(status).json({ status, statusText, message: message ? message[0].detail : 'Error' });
                    }
                } else {
                    res.status(500).json({ success: false, error: 'Something went wrong!' });
                }
            } else {
                res.status(403).json({ success: false, message: 'Passwords do not match' });
            }
        } catch (err) {
            if (err) throw err;
        }
    }
}

export default updatePassword;
