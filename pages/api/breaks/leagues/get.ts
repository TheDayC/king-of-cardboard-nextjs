import { ObjectId } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';

import { connectToDatabase } from '../../../../middleware/database';
import { errorHandler } from '../../../../middleware/errors';
import { parseAsNumber, parseAsString, safelyParse } from '../../../../utils/parsers';

const defaultErr = 'Could not find league.';

async function getLeague(req: NextApiRequest, res: NextApiResponse): Promise<void> {
    if (req.method === 'GET') {
        try {
            const { db } = await connectToDatabase();
            const leaguesCollection = db.collection('leagues');

            const id = safelyParse(req, 'body.id', parseAsString, '');
            const existingLeague = await leaguesCollection.findOne({ _id: new ObjectId(id) });

            if (!existingLeague) {
                res.status(400).json({ message: defaultErr });
                return;
            }

            res.status(200).json(existingLeague);
        } catch (err: unknown) {
            const status = safelyParse(err, 'response.status', parseAsNumber, 500);

            res.status(status).json(errorHandler(err, defaultErr));
        }

        return Promise.resolve();
    }
}

export default getLeague;
