import axios from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';

import { errorHandler } from '../../../middleware/errors';
import { parseAsNumber, parseAsString, parseAsUnknown, safelyParse } from '../../../utils/parsers';

const defaultErr = 'There was a problem fetching this content...';
const url = `https://graphql.contentful.com/content/v1/spaces/${process.env.CONTENTFUL_SPACE_ID}/environments/${process.env.CONTENTFUL_ENV}`;

async function fetchContent(req: NextApiRequest, res: NextApiResponse): Promise<void> {
    if (req.method === 'POST') {
        try {
            const query = safelyParse(req, 'body.query', parseAsString, null);

            if (!query) {
                res.status(400).json({ status: 400, message: 'Bad Request', description: defaultErr });
                return Promise.resolve();
            }

            const contentRes = await axios.get(url, {
                params: {
                    query,
                },
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${process.env.CONTENTFUL_TOKEN}`,
                },
            });
            const content = safelyParse(contentRes, 'data.data', parseAsUnknown, null);

            res.status(200).json({ content });
        } catch (err: unknown) {
            const status = safelyParse(err, 'response.status', parseAsNumber, 500);

            res.status(status).json(errorHandler(err, defaultErr));
        }

        return Promise.resolve();
    }
}

export default fetchContent;
