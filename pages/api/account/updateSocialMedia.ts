import { NextApiRequest, NextApiResponse } from 'next';

import { connectToDatabase } from '../../../middleware/database';
import { parseAsString, safelyParse } from '../../../utils/parsers';

async function updateSocialMedia(req: NextApiRequest, res: NextApiResponse): Promise<void> {
    if (req.method === 'POST') {
        const { db, client } = await connectToDatabase();

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
                    res.status(500).json({ success: false, error: 'Could not update password.' });
                }
            } else {
                res.status(403).json({ success: false, message: 'Could not find profile.' });
            }
        } catch (err) {
            if (err) throw err;
        }
    }
}

export default updateSocialMedia;
