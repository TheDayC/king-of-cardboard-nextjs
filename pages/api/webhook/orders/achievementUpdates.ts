import { NextApiRequest, NextApiResponse } from 'next';
import Cors from 'cors';

import { parseAsNumber, parseAsString, safelyParse } from '../../../../utils/parsers';
import { apiErrorHandler } from '../../../../middleware/errors';
import { runMiddleware } from '../../../../middleware/api';
import {
    calculateAchievements,
    createInitialAchievements,
    fetchAchievements,
    fetchObjectives,
    getCategoriesAndTypes,
    updateAchievements,
} from '../../../../services/achievements';
import { createToken } from '../../../../utils/auth';
import { getLineItems } from '../../../../utils/webhooks';

// Initializing the cors middleware
const cors = Cors({
    origin: ['https://king-of-cardboard.commercelayer.io/'],
    methods: ['POST', 'HEAD'],
});

async function achievementUpdates(req: NextApiRequest, res: NextApiResponse): Promise<void> {
    if (req.method === 'POST') {
        // Run the middleware
        await runMiddleware(req, res, cors);

        try {
            // First fetch a token.
            const { token } = await createToken();

            // If the token doesn't exist, bail.
            if (!token) {
                res.status(500).json({ error: 'Failed to create token for webhook.' });
                return;
            }

            // Find the user's email address in the webhook body.
            const email = safelyParse(req, 'body.data.attributes.customer_email', parseAsString, '');

            // Find the user's achievements and gift card based on their email address.
            const { giftCardId, achievements } = await fetchAchievements(email, token);

            // Parse our webhook items
            const items = getLineItems(req.body.included);
            const hasItems = items && items.length > 0;
            const hasAchievements = achievements && achievements.length > 0;

            // Make checks for required data to proceed with webhook.
            if (!hasItems || !giftCardId) {
                res.status(500).json({ error: 'Failed to find items or gift card.' });
                return;
            }

            // Fetch yet more data to decide which objectives we should update.
            const { categories, types } = getCategoriesAndTypes(items);
            const { objectives } = await fetchObjectives(categories, types);

            // Safeguard our objectives.
            if (!objectives.length) {
                res.status(500).json({ error: 'Failed to find objectives.' });
                return;
            }

            if (hasAchievements) {
                // Calculate achievements based on objectives.
                const { achievements: newAchievements, points } = calculateAchievements(objectives, achievements);

                if (newAchievements.length > 0 && points > 0) {
                    updateAchievements(token, giftCardId, email, newAchievements, points);
                }
            } else {
                // Create the initial set of achievements if none exist.
                const { achievements, points } = createInitialAchievements(objectives);

                if (achievements.length > 0 && points > 0) {
                    updateAchievements(token, giftCardId, email, achievements, points);
                }
            }

            res.status(200).end();
        } catch (error) {
            const status = safelyParse(error, 'response.status', parseAsNumber, 500);

            res.status(status).json(apiErrorHandler(error, 'Failed to send order confirmation email.'));
        }
    }
}

export default achievementUpdates;
