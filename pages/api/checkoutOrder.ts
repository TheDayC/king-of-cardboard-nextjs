import { get } from 'lodash';
import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';

const apiVersion = '2020-08-27';

async function checkoutOrder(req: NextApiRequest, res: NextApiResponse): Promise<void> {
    if (req.method === 'POST' && process.env.STRIPE_SECRET_KEY) {
        const clientSecret = get(req, 'body.clientSecret', null);
        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion });

        try {
            if (clientSecret) {
                const capturedPayment = await stripe.paymentIntents.capture(clientSecret);

                res.status(200).json({ status: capturedPayment.status });
            } else {
                res.status(200).json({ status: 'failed' });
            }
        } catch (err: unknown) {
            const statusCode: number = get(err, 'statusCode', 500);
            const msg: string = get(err, 'message', 'Error');

            res.status(statusCode).json(msg);
        }
    }
}

export default checkoutOrder;
