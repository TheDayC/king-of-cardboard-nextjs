import Stripe from 'stripe';
import { toNumber } from 'lodash';
import { NextApiRequest, NextApiResponse } from 'next';

import { errorHandler } from '../../../middleware/errors';
import { parseAsNumber, safelyParse } from '../../../utils/parsers';

const defaultErr = 'Could not create payment intent.';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', { apiVersion: '2022-11-15' });

async function getPaymentIntent(req: NextApiRequest, res: NextApiResponse): Promise<void> {
    if (req.method === 'GET') {
        try {
            const paymentIntent = await stripe.paymentIntents.create({
                amount: toNumber(req.query.total),
                currency: 'gbp',
                //automatic_payment_methods: {enabled: true},
            });

            res.status(200).json(paymentIntent);
        } catch (err: unknown) {
            const status = safelyParse(err, 'response.status', parseAsNumber, 500);

            res.status(status).json(errorHandler(err, defaultErr));
        }

        return Promise.resolve();
    }
}

export default getPaymentIntent;
