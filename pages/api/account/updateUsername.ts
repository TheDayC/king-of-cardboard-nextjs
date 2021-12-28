import { NextApiRequest, NextApiResponse } from 'next';

import { connectToDatabase } from '../../../middleware/database';
import { errorHandler } from '../../../middleware/errors';
import { parseAsNumber, parseAsString, safelyParse } from '../../../utils/parsers';

const defaultErr = 'We could not update your username.';

async function updateUsername(req: NextApiRequest, res: NextApiResponse): Promise<void> {
    if (req.method === 'POST') {
        const { db } = await connectToDatabase();

        try {
            const emailAddress = safelyParse(req, 'body.emailAddress', parseAsString, null);
            const username = safelyParse(req, 'body.username', parseAsString, null);

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

                if (updatedCreds) {
                    res.status(200).json({ success: true, data: updatedCreds });
                } else {
                    res.status(204);
                }
            } else {
                res.status(403).json({ status: 403, message: 'Forbidden', description: 'Passwords do not match.' });
            }
        } catch (err: unknown) {
            const status = safelyParse(err, 'response.status', parseAsNumber, 500);

            res.status(status).json(errorHandler(err, defaultErr));
        }
    }
}

export default updateUsername;
