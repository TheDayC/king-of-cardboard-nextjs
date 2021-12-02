import { NextApiRequest, NextApiResponse } from 'next';

import {
    parseAsArrayOfCommerceLayerErrors,
    parseAsCommerceResponseArray,
    parseAsNumber,
    parseAsString,
    safelyParse,
} from '../../../utils/parsers';
import { authClient } from '../../../utils/auth';

async function getAddresses(req: NextApiRequest, res: NextApiResponse): Promise<void> {
    if (req.method === 'POST') {
        try {
            const token = safelyParse(req, 'body.token', parseAsString, null);
            const emailAddress = safelyParse(req, 'body.emailAddress', parseAsString, null);
            const pageSize = safelyParse(req, 'body.pageSize', parseAsNumber, 5);
            const page = safelyParse(req, 'body.page', parseAsNumber, 1);

            const filters = `filter[q][email_eq]=${emailAddress}`;
            const pagination = `page[size]=${pageSize}&page[number]=${page}`;

            const cl = authClient(token);

            const response = await cl.get(`/api/customer_addresses?${filters}&${pagination}`);
            const status = safelyParse(response, 'status', parseAsNumber, 500);
            const addresses = safelyParse(response, 'data.data', parseAsCommerceResponseArray, null);

            res.status(status).json({ addresses });
        } catch (error) {
            const status = safelyParse(error, 'response.status', parseAsNumber, 500);
            const statusText = safelyParse(error, 'response.statusText', parseAsString, 'Error');
            const message = safelyParse(error, 'response.data.errors', parseAsArrayOfCommerceLayerErrors, null);

            res.status(status).json({ status, statusText, message });
        }
    }
}

export default getAddresses;
