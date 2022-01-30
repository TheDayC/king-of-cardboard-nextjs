import { NextApiRequest, NextApiResponse } from 'next';
import * as contentful from 'contentful';

import { errorHandler } from '../../../middleware/errors';
import { parseAsNumber, parseAsString, safelyParse } from '../../../utils/parsers';

const defaultErr = 'There was a problem fetching this asset...';

async function fetchAsset(req: NextApiRequest, res: NextApiResponse): Promise<void> {
    if (req.method === 'POST') {
        try {
            const assetId = safelyParse(req, 'body.assetId', parseAsString, '');
            const client = contentful.createClient({
                space: process.env.CONTENTFUL_SPACE_ID || '',
                accessToken: process.env.CONTENTFUL_TOKEN || '',
            });
            const asset = await client.getAsset(assetId);

            res.status(200).json({ asset });
        } catch (err: unknown) {
            const status = safelyParse(err, 'response.status', parseAsNumber, 500);

            res.status(status).json(errorHandler(err, defaultErr));
        }

        return Promise.resolve();
    }
}

export default fetchAsset;
