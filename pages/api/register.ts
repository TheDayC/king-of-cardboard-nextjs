import { get } from 'lodash';
import { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcrypt';

import { connectToDatabase } from '../../middleware/database';

async function register(req: NextApiRequest, res: NextApiResponse): Promise<void> {
    if (req.method === 'POST') {
        const username = get(req, 'body.username', '');
        const emailAddress = get(req, 'body.emailAddress', '');
        const password = get(req, 'body.password', '');

        const { db } = await connectToDatabase();
        const collection = db.collection('users');
        const user = await collection.findOne({ emailAddress });

        if (user) {
            res.status(403).json({ response: 'Email already assigned to a user' });
        } else {
            const hash = await bcrypt.hash(password, parseInt(process.env.SALT_ROUNDS || '1'));

            if (hash) {
                const userDocument = {
                    username,
                    emailAddress,
                    password: hash,
                    authType: 'credentials',
                };

                const createdUser = await collection.insertOne(userDocument);

                if (createdUser) {
                    res.status(200).json({ success: true, data: createdUser });
                } else {
                    res.status(500).json({ success: false, error: 'Could not create user' });
                }
            } else {
                res.status(500).json({ success: false, error: 'Unable to hash password.' });
            }
        }
    }
}

export default register;
