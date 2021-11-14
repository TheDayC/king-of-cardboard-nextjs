import { NextApiRequest, NextApiResponse } from 'next';

import { authClient } from '../../../utils/auth';
import { parseAsArrayOfStrings, parseAsNumber, parseAsString, safelyParse } from '../../../utils/parsers';

async function createGiftCard(req: NextApiRequest, res: NextApiResponse): Promise<void> {
    if (req.method === 'POST') {
        try {
            const token = safelyParse(req, 'body.token', parseAsString, null);
            const emailAddress = safelyParse(req, 'body.emailAddress', parseAsString, null);

            const cl = authClient(token);

            // Send a post requet to setup a draft gift card.
            const draftGiftCard = await cl.post('/api/gift_cards', {
                data: {
                    type: 'gift_cards',
                    attributes: {
                        currency_code: 'GBP',
                        balance_cents: 0,
                        single_use: false,
                        rechargeable: true,
                        recipient_email: emailAddress,
                        reference: `${emailAddress}-reward-card`,
                    },
                },
            });

            // Find the gift card id.
            const giftCardId = safelyParse(draftGiftCard, 'data.id', parseAsString, null);

            if (giftCardId) {
                // If the gift card id exists then purchase it.
                const purchasedGiftCard = await cl.patch(`/api/gift_cards/${giftCardId}`, {
                    data: {
                        type: 'gift_cards',
                        attributes: {
                            _purchase: true,
                        },
                    },
                });

                if (purchasedGiftCard) {
                    // If the gift card has been purchased then activate it.
                    const activatedGiftCard = await cl.patch(`/api/gift_cards/${giftCardId}`, {
                        data: {
                            type: 'gift_cards',
                            attributes: {
                                _activate: true,
                            },
                        },
                    });

                    const status = safelyParse(activatedGiftCard, 'status', parseAsNumber, 500);
                    res.status(status).json({ giftCard: activatedGiftCard });
                } else {
                    const status = safelyParse(purchasedGiftCard, 'status', parseAsNumber, 500);
                    res.status(status).json({ giftCard: purchasedGiftCard });
                }
            } else {
                const status = safelyParse(draftGiftCard, 'status', parseAsNumber, 500);
                res.status(status).json({ giftCard: draftGiftCard });
            }
        } catch (err: unknown) {
            const status = safelyParse(err, 'response.status', parseAsNumber, 500);
            const statusText = safelyParse(err, 'response.statusText', parseAsString, '');
            const message = safelyParse(err, 'response.data.errors', parseAsArrayOfStrings, [
                'Something went very wrong! Likely a problem connecting to commercelayer.',
            ]);

            res.status(status).json({ status, statusText, message });
        }
    }
}

export default createGiftCard;
