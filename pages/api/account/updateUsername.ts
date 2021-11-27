import { NextApiRequest, NextApiResponse } from 'next';

import { connectToDatabase } from '../../../middleware/database';
import { parseAsString, safelyParse } from '../../../utils/parsers';

async function updateUsername(req: NextApiRequest, res: NextApiResponse): Promise<void> {
    if (req.method === 'POST') {
        const emailAddress = safelyParse(req, 'body.emailAddress', parseAsString, null);
        const username = safelyParse(req, 'body.username', parseAsString, null);

        const { db, client } = await connectToDatabase();
        const credsCollection = db.collection('credentials');
        const creds = await credsCollection.findOne({ emailAddress });

        if (creds && username) {
            // Set new values to update in collection.
            const values = {
                $set: {
                    username,
                },
            };

            // Update document in collection.
            const updatedCreds = await credsCollection.updateOne({ emailAddress }, values);
            client.close();

            if (updatedCreds) {
                res.status(200).json({ success: true, data: updatedCreds });
            } else {
                res.status(500).json({ success: false, error: 'Could not update password.' });
            }
        } else {
            res.status(403).json({ success: false, message: 'Passwords do not match' });
        }
    }
}

export default updateUsername;
