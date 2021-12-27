import { NextApiRequest, NextApiResponse } from 'next';

import { parseAsArrayOfCommerceLayerErrors, parseAsNumber, parseAsString, safelyParse } from '../../../utils/parsers';
import { authClient } from '../../../utils/auth';

async function resetPassword(req: NextApiRequest, res: NextApiResponse): Promise<void> {
    if (req.method === 'POST') {
        try {
            const password = safelyParse(req, 'body.password', parseAsString, null);
            const confirmPassword = safelyParse(req, 'body.confirmPassword', parseAsString, null);
            const token = safelyParse(req, 'body.token', parseAsString, null);
            const resetToken = safelyParse(req, 'body.resetToken', parseAsString, null);
            const id = safelyParse(req, 'body.id', parseAsString, null);

            const passwordsMatch = password === confirmPassword;
            const cl = authClient(token);

            if (password && passwordsMatch) {
                try {
                    await cl.patch(`/api/customer_password_resets/${id}`, {
                        data: {
                            type: 'customer_password_resets',
                            id: id,
                            attributes: {
                                customer_password: password,
                                _reset_password_token: resetToken,
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

export default resetPassword;
