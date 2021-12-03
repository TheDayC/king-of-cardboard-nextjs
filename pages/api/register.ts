import { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcrypt';

import { connectToDatabase } from '../../middleware/database';
import { parseAsArrayOfCommerceLayerErrors, parseAsNumber, parseAsString, safelyParse } from '../../utils/parsers';
import { authClient } from '../../utils/auth';

async function register(req: NextApiRequest, res: NextApiResponse): Promise<void> {
    if (req.method === 'POST') {
        const { db, client } = await connectToDatabase();

        try {
            const username = safelyParse(req, 'body.username', parseAsString, '');
            const emailAddress = safelyParse(req, 'body.emailAddress', parseAsString, '');
            const password = safelyParse(req, 'body.password', parseAsString, '');
            const token = safelyParse(req, 'body.token', parseAsString, '');
            const cl = authClient(token);

            const credsCollection = db.collection('credentials');
            const usersCollection = db.collection('users');
            const creds = await credsCollection.findOne({ emailAddress });
            const user = await usersCollection.findOne({ emailAddress });

            if (creds || user) {
                res.status(403).json({ response: 'Email already assigned to a user' });
            } else {
                const hash = await bcrypt.hash(password, parseInt(process.env.SALT_ROUNDS || '1'));

                if (hash) {
                    try {
                        const customer = await cl.post(`/api/customers`, {
                            data: {
                                type: 'customers',
                                attributes: {
                                    email: emailAddress,
                                    password,
                                },
                            },
                        });

                        const userDocument = {
                            username,
                            emailAddress,
                            password: hash,
                            commerceId: safelyParse(customer, 'data.data.id', parseAsString, null),
                        };

                        const createdUser = await credsCollection.insertOne(userDocument);

                        res.status(200).json({ success: true, data: createdUser });
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
                    res.status(500).json({ success: false, error: 'Unable to hash password.' });
                }
            }
        } catch (err) {
            if (err) throw err;
        }
    }
}

export default register;
