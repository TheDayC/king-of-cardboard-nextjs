import { NextApiRequest, NextApiResponse } from 'next';

import { connectToDatabase } from '../../middleware/database';
import { parseAsNumber, parseAsString, safelyParse } from '../../utils/parsers';
import { authClient } from '../../utils/auth';
import { apiErrorHandler } from '../../middleware/errors';
import { gaEvent } from '../../utils/ga';

async function register(req: NextApiRequest, res: NextApiResponse): Promise<void> {
    if (req.method === 'POST') {
        const { db } = await connectToDatabase();
        const username = safelyParse(req, 'body.username', parseAsString, '');
        const emailAddress = safelyParse(req, 'body.emailAddress', parseAsString, '');
        const password = safelyParse(req, 'body.password', parseAsString, '');
        const token = safelyParse(req, 'body.token', parseAsString, '');
        const cl = authClient(token);

        try {
            const customerData = await cl.get(`/api/customers?filter[q][email_eq]=${emailAddress}`);
            const customerCount = safelyParse(customerData, 'data.meta.record_count', parseAsNumber, 0);
            const credsCollection = db.collection('credentials');

            if (customerCount > 0) {
                res.status(403).json({ error: 'Email already assigned to a user' });
            } else {
                const customer = await cl.post('/api/customers', {
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
                    commerceId: safelyParse(customer, 'data.data.id', parseAsString, null),
                };

                const createdUser = await credsCollection.insertOne(userDocument);

                gaEvent('register', { email: emailAddress });

                res.status(200).json({ success: true, data: createdUser });
            }
        } catch (error) {
            const status = safelyParse(error, 'response.status', parseAsNumber, 500);

            res.status(status).json(apiErrorHandler(error, 'Failed to send order confirmation email.'));
        }
    }
}

export default register;
