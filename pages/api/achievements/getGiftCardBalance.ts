import { get } from 'lodash';
import { NextApiRequest, NextApiResponse } from 'next';

import { connectToDatabase } from '../../../middleware/database';
import { authClient } from '../../../utils/auth';
import { parseAsArrayOfStrings, parseAsNumber, parseAsString, safelyParse } from '../../../utils/parsers';

async function getGiftCardBalance(req: NextApiRequest, res: NextApiResponse): Promise<void> {
    if (req.method === 'POST') {
        try {
            const token = safelyParse(req, 'body.token', parseAsString, null);
            const emailAddress = safelyParse(req, 'body.emailAddress', parseAsString, null);
            const cl = authClient(token);
            const { db } = await connectToDatabase();
            const achievementsCollection = db.collection('achievements');
            const achievements = await achievementsCollection.findOne({ emailAddress });

            if (achievements) {
                const giftCardId = safelyParse(achievements, 'giftCardId', parseAsString, null);

                if (giftCardId) {
                    // If the gift card id exists fetch its balance.
                    const giftCard = await cl.get(`/api/gift_cards/${giftCardId}?fields[gift_cards]=balance_cents`);
                    const giftCardData = get(giftCard, 'data.data', null);

                    const status = safelyParse(giftCard, 'status', parseAsNumber, 500);
                    const balance = safelyParse(giftCardData, 'attributes.balance_cents', parseAsNumber, 0);

                    res.status(status).json({ balance });
                } else {
                    const status = safelyParse(giftCardId, 'status', parseAsNumber, 500);
                    res.status(status).json({ giftCardId });
                }
            }
        } catch (err: unknown) {
            const status = safelyParse(err, 'response.status', parseAsNumber, 500);
            const statusText = safelyParse(err, 'response.statusText', parseAsString, '');
            const message = safelyParse(err, 'response.data.errors', parseAsArrayOfStrings, [
                'Something went very wrong! Likely a problem connecting to commercelayer.',
            ]);

            res.status(status).json({ status, statusText, message });
        }

        return Promise.resolve();
    }
}

export default getGiftCardBalance;
