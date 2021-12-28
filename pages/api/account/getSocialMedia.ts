import { NextApiRequest, NextApiResponse } from 'next';

import { connectToDatabase } from '../../../middleware/database';
import { errorHandler } from '../../../middleware/errors';
import { parseAsNumber, parseAsString, safelyParse } from '../../../utils/parsers';

const defaultErr = 'Could not get social media.';

async function getSocialMedia(req: NextApiRequest, res: NextApiResponse): Promise<void> {
    if (req.method === 'POST') {
        const { db } = await connectToDatabase();

        try {
            const emailAddress = safelyParse(req, 'body.emailAddress', parseAsString, null);
            const profileCollection = db.collection('profile');
            const profile = await profileCollection.findOne({ emailAddress });

            if (profile) {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const { emailAddress: email, _id, ...socialMedia } = profile;

                res.status(200).json({ success: true, socialMedia });
            } else {
                res.status(204).json({ success: false });
            }
        } catch (err: unknown) {
            const status = safelyParse(err, 'response.status', parseAsNumber, 500);

            res.status(status).json(errorHandler(err, defaultErr));
        }
    }
}

export default getSocialMedia;
