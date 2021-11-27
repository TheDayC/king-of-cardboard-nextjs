import { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcrypt';

import { connectToDatabase } from '../../../middleware/database';
import { parseAsString, safelyParse } from '../../../utils/parsers';

async function updatePassword(req: NextApiRequest, res: NextApiResponse): Promise<void> {
    if (req.method === 'POST') {
        const emailAddress = safelyParse(req, 'body.emailAddress', parseAsString, '');
        const password = safelyParse(req, 'body.password', parseAsString, null);
        const confirmPassword = safelyParse(req, 'body.confirmPassword', parseAsString, null);

        const { db, client } = await connectToDatabase();
        const credsCollection = db.collection('credentials');
        const creds = await credsCollection.findOne({ emailAddress });
        const passwordsMatch = password === confirmPassword;
        client.close();

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

                if (updatedCreds) {
                    res.status(200).json({ success: true, data: updatedCreds });
                } else {
                    res.status(500).json({ success: false, error: 'Could not update password.' });
                }
            } else {
                res.status(500).json({ success: false, error: 'Something went wrong!' });
            }
        } else {
            res.status(403).json({ success: false, message: 'Passwords do not match' });
        }
    }
}

export default updatePassword;
