import { NextApiRequest, NextApiResponse } from 'next';

import { connectToDatabase } from '../../../middleware/database';
import { errorHandler } from '../../../middleware/errors';
import { parseAsNumber, parseAsString, safelyParse } from '../../../utils/parsers';

const defaultErr = 'We could not update your social media.';

async function updateSocialMedia(req: NextApiRequest, res: NextApiResponse): Promise<void> {
    if (req.method === 'POST') {
        const { db } = await connectToDatabase();

        try {
            const emailAddress = safelyParse(req, 'body.emailAddress', parseAsString, null);
            const instagram = safelyParse(req, 'body.instagram', parseAsString, '');
            const twitter = safelyParse(req, 'body.twitter', parseAsString, '');
            const twitch = safelyParse(req, 'body.twitch', parseAsString, '');
            const youtube = safelyParse(req, 'body.youtube', parseAsString, '');
            const ebay = safelyParse(req, 'body.ebay', parseAsString, '');

            const profileCollection = db.collection('profile');
            const profile = await profileCollection.findOne({ emailAddress });

            if (profile) {
                // Set new values to update in collection.
                const values = {
                    $set: {
                        instagram,
                        twitter,
                        twitch,
                        youtube,
                        ebay,
                    },
                };

                // Update document in collection.
                const updatedProfile = await profileCollection.updateOne({ emailAddress }, values);

                if (updatedProfile) {
                    res.status(200).json({ success: true, data: updatedProfile });
                } else {
                    res.status(204);
                }
            } else {
                res.status(403).json({ success: false, message: 'Could not find profile.' });
            }
        } catch (err: unknown) {
            const status = safelyParse(err, 'response.status', parseAsNumber, 500);

            res.status(status).json(errorHandler(err, defaultErr));
        }
    }
}

export default updateSocialMedia;
