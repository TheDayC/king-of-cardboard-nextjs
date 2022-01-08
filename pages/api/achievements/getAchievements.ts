import { NextApiRequest, NextApiResponse } from 'next';

import { connectToDatabase } from '../../../middleware/database';
import { errorHandler } from '../../../middleware/errors';
import { authClient } from '../../../utils/auth';
import { parseAsArrayOfAchievements, parseAsNumber, parseAsString, safelyParse } from '../../../utils/parsers';

const defaultErr = 'We could not fetch your achievements.';

async function getAchievements(req: NextApiRequest, res: NextApiResponse): Promise<void> {
    if (req.method === 'POST') {
        try {
            const { db } = await connectToDatabase();
            const accessToken = safelyParse(req, 'body.accessToken', parseAsString, null);
            const emailAddress = safelyParse(req, 'body.emailAddress', parseAsString, null);

            const achievementsCollection = db.collection('achievements');
            const achievementsDocument = await achievementsCollection.findOne({ emailAddress });

            if (achievementsDocument) {
                const giftCardId = safelyParse(achievementsDocument, 'giftCardId', parseAsString, null);
                const achievements = safelyParse(
                    achievementsDocument,
                    'achievements',
                    parseAsArrayOfAchievements,
                    null
                );

                res.status(200).json({ giftCardId, achievements });
            } else {
                // Set up achievements document if the user hasn't logged in before.
                if (accessToken) {
                    const cl = authClient(accessToken);

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
                    const giftCardId = safelyParse(draftGiftCard, 'data.data.id', parseAsString, null);

                    if (giftCardId) {
                        // If the gift card id exists then purchase it.
                        const purchasedGiftCard = await cl.patch(`/api/gift_cards/${giftCardId}`, {
                            data: {
                                type: 'gift_cards',
                                id: giftCardId,
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
                                    id: giftCardId,
                                    attributes: {
                                        _activate: true,
                                    },
                                },
                            });

                            if (activatedGiftCard) {
                                await achievementsCollection.insertOne({
                                    emailAddress,
                                    giftCardId,
                                });
                            }
                        }
                    }

                    const achievementsDocument = await achievementsCollection.findOne({ emailAddress });

                    const achievements = safelyParse(
                        achievementsDocument,
                        'achievements',
                        parseAsArrayOfAchievements,
                        null
                    );

                    res.status(200).json({ giftCardId, achievements });
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

export default getAchievements;
