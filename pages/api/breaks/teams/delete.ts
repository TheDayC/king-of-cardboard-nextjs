import { ObjectId } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';

import { connectToDatabase } from '../../../../middleware/database';
import { errorHandler } from '../../../../middleware/errors';
import { parseAsNumber, parseAsString, safelyParse } from '../../../../utils/parsers';

const defaultErr = 'Team could not be deleted.';

async function deleteTeam(req: NextApiRequest, res: NextApiResponse): Promise<void> {
    if (req.method === 'DELETE') {
        try {
            const { db } = await connectToDatabase();
            const teamsCollection = db.collection('teams');

            const id = safelyParse(req, 'body.id', parseAsString, '');
            const existingTeam = await teamsCollection.findOne({ _id: new ObjectId(id) });

            if (!existingTeam) {
                res.status(400).json({ message: 'Team does not exist.' });
                return;
            }

            await teamsCollection.deleteOne({ _id: new ObjectId(id) });

            res.status(204).end();
        } catch (err: unknown) {
            const status = safelyParse(err, 'response.status', parseAsNumber, 500);

            res.status(status).json(errorHandler(err, defaultErr));
        }

        return Promise.resolve();
    }
}

export default deleteTeam;
