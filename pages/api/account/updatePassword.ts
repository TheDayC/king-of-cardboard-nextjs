import { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcrypt';

import { connectToDatabase } from '../../../middleware/database';
import {
    parseAsArrayOfCommerceLayerErrors,
    parseAsCommerceResponseArray,
    parseAsNumber,
    parseAsString,
    safelyParse,
} from '../../../utils/parsers';
import { authClient } from '../../../utils/auth';

async function updatePassword(req: NextApiRequest, res: NextApiResponse): Promise<void> {
    if (req.method === 'POST') {
        try {
            const emailAddress = safelyParse(req, 'body.emailAddress', parseAsString, '');
            const password = safelyParse(req, 'body.password', parseAsString, null);
            const confirmPassword = safelyParse(req, 'body.confirmPassword', parseAsString, null);
            const token = safelyParse(req, 'body.token', parseAsString, null);

            const passwordsMatch = password === confirmPassword;
            const cl = authClient(token);

            if (password && passwordsMatch) {
                try {
                    const customer = await cl.get(`/api/customers/?filter[q][email_eq]=${emailAddress}`);
                    const customerResponse = safelyParse(customer, 'data.data', parseAsCommerceResponseArray, null);

                    if (!customerResponse) {
                        res.status(404).json({
                            status: 404,
                            statusText: 'Not Found',
                            message: 'The requested resource was not found.',
                        });
                        return;
                    }

                    const customerId = customerResponse[0].id;

                    await cl.patch(`/api/customers/${customerId}`, {
                        data: {
                            type: 'customers',
                            id: customerId,
                            attributes: {
                                password,
                            },
                        },
                    });

                    res.status(200).json({ success: true });
                } catch (error) {
                    const status = safelyParse(error, 'response.status', parseAsNumber, 500);
                    const statusText = safelyParse(error, 'response.statusText', parseAsString, 'Error');
                    const message = safelyParse(error, 'response.data.errors', parseAsArrayOfCommerceLayerErrors, null);

                    res.status(status).json({ status, statusText, message: message ? message[0].detail : 'Error' });
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
