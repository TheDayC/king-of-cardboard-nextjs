import { ObjectId } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';

import { connectToDatabase } from '../../../../middleware/database';
import { errorHandler } from '../../../../middleware/errors';
import { parseAsNumber, parseAsString, safelyParse } from '../../../../utils/parsers';

const defaultErr = 'Could not find product.';

async function getCoins(req: NextApiRequest, res: NextApiResponse): Promise<void> {
    if (req.method === 'GET') {
        try {
            const userId = safelyParse(req, 'query.userId', parseAsString, null);

            if (!userId) {
                res.status(404).json({ message: 'User does not exist.' });
                return Promise.resolve();
            }

            const { db } = await connectToDatabase();
            const usersCollection = db.collection('users');
            const user = await usersCollection.findOne({ _id: new ObjectId(userId) });

            if (!user) {
                res.status(404).json({ message: 'User does not exist.' });
                return Promise.resolve();
            }

            res.status(200).json({ coins: user.coins });
        } catch (err: unknown) {
            const status = safelyParse(err, 'response.status', parseAsNumber, 500);

            res.status(status).json(errorHandler(err, defaultErr));
        }
        return Promise.resolve();
    }
}

export default getCoins;
