import { NextApiRequest, NextApiResponse } from 'next';

import { connectToDatabase } from '../../../middleware/database';
import { errorHandler } from '../../../middleware/errors';
import { authClient } from '../../../utils/auth';
import { parseAsCommerceResponse, parseAsNumber, parseAsString, safelyParse } from '../../../utils/parsers';

const defaultErr = 'We could not update your gift card balance.';

async function getGiftCardBalance(req: NextApiRequest, res: NextApiResponse): Promise<void> {
    if (req.method === 'POST') {
        const { db } = await connectToDatabase();

        try {
            const token = safelyParse(req, 'body.token', parseAsString, null);
            const emailAddress = safelyParse(req, 'body.emailAddress', parseAsString, null);
            const cl = authClient(token);
            const achievementsCollection = db.collection('achievements');
            const achievements = await achievementsCollection.findOne({ emailAddress });

            if (achievements) {
                const giftCardId = safelyParse(achievements, 'giftCardId', parseAsString, null);

                if (giftCardId) {
                    // If the gift card id exists fetch its balance.
                    const giftCard = await cl.get(`/api/gift_cards/${giftCardId}?fields[gift_cards]=balance_cents`);
                    const giftCardData = safelyParse(giftCard, 'data.data', parseAsCommerceResponse, null);
                    const balance = safelyParse(giftCardData, 'attributes.balance_cents', parseAsNumber, 0);
                    const status = giftCard ? 200 : 400;
                    const body = giftCard ? { balance } : { status, message: 'Bad Request', description: defaultErr };

                    res.status(status).json(body);
                } else {
                    res.status(400).json({ status: 400, message: 'Bad Request', description: defaultErr });
                }
            }
        } catch (err: unknown) {
            const status = safelyParse(err, 'response.status', parseAsNumber, 500);

            res.status(status).json(errorHandler(err, defaultErr));
        }

        return Promise.resolve();
    }
}

export default getGiftCardBalance;
