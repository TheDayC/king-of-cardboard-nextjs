import { ObjectId } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';

import { connectToDatabase } from '../../../middleware/database';
import { errorHandler } from '../../../middleware/errors';
import { parseAsNumber, parseAsString, safelyParse } from '../../../utils/parsers';

const defaultErr = 'Could not find shipping method.';

async function getShipping(req: NextApiRequest, res: NextApiResponse): Promise<void> {
    if (req.method === 'GET') {
        try {
            const { db } = await connectToDatabase();
            const shippingCollection = db.collection('shipping');

            const id = safelyParse(req, 'body.id', parseAsString, '');
            const existingShipping = await shippingCollection.findOne({ _id: new ObjectId(id) });

            if (!existingShipping) {
                res.status(400).json({ message: defaultErr });
                return;
            }

            res.status(200).json(existingShipping);
        } catch (err: unknown) {
            const status = safelyParse(err, 'response.status', parseAsNumber, 500);

            res.status(status).json(errorHandler(err, defaultErr));
        }

        return Promise.resolve();
    }
}

export default getShipping;
