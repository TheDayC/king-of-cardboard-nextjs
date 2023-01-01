import { DateTime } from 'luxon';
import { ObjectId } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';

import { connectToDatabase } from '../../../../middleware/database';
import { errorHandler } from '../../../../middleware/errors';
import { parseAsNumber, parseAsString, safelyParse } from '../../../../utils/parsers';

const defaultErr = 'Team could not be updated.';

async function editTeam(req: NextApiRequest, res: NextApiResponse): Promise<void> {
    if (req.method === 'PUT') {
        try {
            const { db } = await connectToDatabase();
            const teamsCollection = db.collection('teams');

            const id = new ObjectId(safelyParse(req, 'body.id', parseAsString, ''));
            const existingTeam = await teamsCollection.findOne({ _id: id });
            const currentDate = DateTime.now().setZone('Europe/London');

            if (!existingTeam) {
                res.status(400).json({ message: 'Team does not exist.' });
                return;
            }

            await teamsCollection.updateOne(
                { _id: id },
                {
                    $set: {
                        title: safelyParse(req, 'body.title', parseAsString, existingTeam.title),
                        lastUpdated: new Date(currentDate.toISO()),
                        image: safelyParse(req, 'body.image', parseAsString, existingTeam.image),
                    },
                }
            );

            res.status(204).end();
        } catch (err: unknown) {
            const status = safelyParse(err, 'response.status', parseAsNumber, 500);

            res.status(status).json(errorHandler(err, defaultErr));
        }

        return Promise.resolve();
    }
}

export default editTeam;
