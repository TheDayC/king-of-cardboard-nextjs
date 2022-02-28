import { NextApiRequest, NextApiResponse } from 'next';

import { corsFunction } from '../types/api';

// Helper method to wait for a middleware to execute before continuing
// And to throw an error when an error happens in a middleware
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function runMiddleware(req: NextApiRequest, res: NextApiResponse, fn: corsFunction): Promise<any> {
    return new Promise((resolve, reject) => {
        fn(req, res, (result) => {
            if (result instanceof Error) {
                return reject(result);
            }

            return resolve(result);
        });
    });
}
