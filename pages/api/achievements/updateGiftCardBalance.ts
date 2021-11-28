import { NextApiRequest, NextApiResponse } from 'next';

import { authClient } from '../../../utils/auth';
import { parseAsArrayOfStrings, parseAsNumber, parseAsString, safelyParse } from '../../../utils/parsers';

async function updateGiftCardBalance(req: NextApiRequest, res: NextApiResponse): Promise<void> {
    if (req.method === 'POST') {
        try {
            const token = safelyParse(req, 'body.token', parseAsString, null);
            const giftCardId = safelyParse(req, 'body.giftCardId', parseAsString, null);
            const points = safelyParse(req, 'body.points', parseAsNumber, null);

            const cl = authClient(token);

            if (giftCardId) {
                // If the gift card id exists fetch its balance.
                const giftCard = await cl.patch(`/api/gift_cards/${giftCardId}`, {
                    data: {
                        type: 'gift_cards',
                        id: giftCardId,
                        attributes: {
                            balance_cents: points,
                        },
                    },
                });

                const status = safelyParse(giftCard, 'status', parseAsNumber, 500);
                res.status(status).json({ hasUpdated: true });
            } else {
                const status = safelyParse(giftCardId, 'status', parseAsNumber, 500);
                res.status(status).json({ giftCardId });
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

export default updateGiftCardBalance;
