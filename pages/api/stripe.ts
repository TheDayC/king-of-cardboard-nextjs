import { get } from 'lodash';
import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';

import { StripeLineItems } from '../../types/api';

// eslint-disable-next-line @typescript-eslint/no-var-requires
// const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const apiVersion = '2020-08-27';

async function stripeCheckoutHandler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
    if (req.method === 'POST' && process.env.STRIPE_SECRET_KEY) {
        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion });
        const lineItems: StripeLineItems[] = get(req, 'lineItems', []);

        try {
            // Create Checkout Sessions from body params.
            const session = await stripe.checkout.sessions.create({
                /* line_items: [
                    {
                        // TODO: replace this with the `price` of the product you want to sell
                        price: '{{PRICE_ID}}',
                        quantity,
                    },
                ], */
                line_items: lineItems,
                payment_method_types: ['card'],
                mode: 'payment',
                success_url: `${req.headers.origin}/?success=true&session_id={CHECKOUT_SESSION_ID}`,
                cancel_url: `${req.headers.origin}/?canceled=true`,
            });

            if (session) {
                res.redirect(303, session.url || '/');
            }
        } catch (err: unknown) {
            const statusCode: number = get(err, 'statusCode', 500);
            const msg: string = get(err, 'message', 'Error');

            res.status(statusCode).json(msg);
        }
    }
}

export default stripeCheckoutHandler;
