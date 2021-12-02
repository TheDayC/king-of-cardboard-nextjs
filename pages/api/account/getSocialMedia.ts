import { NextApiRequest, NextApiResponse } from 'next';

import { connectToDatabase } from '../../../middleware/database';
import { parseAsString, safelyParse } from '../../../utils/parsers';

async function getSocialMedia(req: NextApiRequest, res: NextApiResponse): Promise<void> {
    if (req.method === 'POST') {
        const emailAddress = safelyParse(req, 'body.emailAddress', parseAsString, null);

        const { db, client } = await connectToDatabase();
        const profileCollection = db.collection('profile');
        const profile = await profileCollection.findOne({ emailAddress });

        if (profile) {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { emailAddress: email, _id, ...socialMedia } = profile;

            res.status(200).json({ success: true, socialMedia });
        } else {
            res.status(403).json({ success: false, message: 'Could not find profile.' });
        }
    }
}

export default getSocialMedia;
