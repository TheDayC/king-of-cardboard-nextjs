import { ObjectId } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';

import { connectToDatabase } from '../../../../middleware/database';
import { errorHandler } from '../../../../middleware/errors';
import { parseAsNumber, parseAsString, safelyParse } from '../../../../utils/parsers';

const defaultErr = 'Sport could not be deleted.';

async function deleteSport(req: NextApiRequest, res: NextApiResponse): Promise<void> {
    if (req.method === 'DELETE') {
        try {
            const { db } = await connectToDatabase();
            const sportsCollection = db.collection('sports');

            const id = safelyParse(req, 'body.id', parseAsString, '');
            const existingSport = await sportsCollection.findOne({ _id: new ObjectId(id) });

            if (!existingSport) {
                res.status(400).json({ message: 'Sport does not exist.' });
                return;
            }

            await sportsCollection.deleteOne({ _id: new ObjectId(id) });

            res.status(204).end();
        } catch (err: unknown) {
            const status = safelyParse(err, 'response.status', parseAsNumber, 500);

            res.status(status).json(errorHandler(err, defaultErr));
        }

        return Promise.resolve();
    }
}

export default deleteSport;
