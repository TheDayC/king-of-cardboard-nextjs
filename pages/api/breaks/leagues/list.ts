import { NextApiRequest, NextApiResponse } from 'next';

import { connectToDatabase } from '../../../../middleware/database';
import { errorHandler } from '../../../../middleware/errors';
import { parseAsNumber, safelyParse } from '../../../../utils/parsers';

const defaultErr = 'Could not find any leagues.';

async function listLeagues(req: NextApiRequest, res: NextApiResponse): Promise<void> {
    if (req.method === 'GET') {
        try {
            const { db } = await connectToDatabase();

            const leaguesCollection = db.collection('leagues');
            const count = safelyParse(req, 'body.count', parseAsNumber, 10);
            const page = safelyParse(req, 'body.page', parseAsNumber, 0);

            const leaguesCount = await leaguesCollection.countDocuments();
            const leaguesList = await leaguesCollection.find().skip(page).limit(count).toArray();

            if (leaguesList.length === 0) {
                res.status(400).json({ message: defaultErr });
                return;
            }

            res.status(200).json({ leagues: leaguesList, count: leaguesCount });
        } catch (err: unknown) {
            const status = safelyParse(err, 'response.status', parseAsNumber, 500);

            res.status(status).json(errorHandler(err, defaultErr));
        }

        return Promise.resolve();
    }
}

export default listLeagues;
