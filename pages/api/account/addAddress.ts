import { NextApiRequest, NextApiResponse } from 'next';

import { parseAsArrayOfCommerceLayerErrors, parseAsNumber, parseAsString, safelyParse } from '../../../utils/parsers';
import { authClient } from '../../../utils/auth';
import { connectToDatabase } from '../../../middleware/database';

async function addAddress(req: NextApiRequest, res: NextApiResponse): Promise<void> {
    if (req.method === 'POST') {
        const { db } = await connectToDatabase();

        try {
            const token = safelyParse(req, 'body.token', parseAsString, null);
            const email = safelyParse(req, 'body.emailAddress', parseAsString, null);
            const first_name = safelyParse(req, 'body.firstName', parseAsString, null);
            const last_name = safelyParse(req, 'body.lastName', parseAsString, null);
            const company = safelyParse(req, 'body.company', parseAsString, null);
            const line_1 = safelyParse(req, 'body.addressLineOne', parseAsString, null);
            const line_2 = safelyParse(req, 'body.addressLineTwo', parseAsString, null);
            const city = safelyParse(req, 'body.city', parseAsString, null);
            const zip_code = safelyParse(req, 'body.postcode', parseAsString, null);
            const state_code = safelyParse(req, 'body.county', parseAsString, null);
            const phone = safelyParse(req, 'body.phone', parseAsString, null);

            const cl = authClient(token);
            const credsCollection = db.collection('credentials');
            const creds = await credsCollection.findOne({ emailAddress: email });

            const addressResponse = await cl.post('/api/addresses', {
                data: {
                    type: 'addresses',
                    attributes: {
                        first_name,
                        last_name,
                        company,
                        line_1,
                        line_2,
                        city,
                        zip_code,
                        state_code,
                        country_code: 'GB',
                        phone,
                        email,
                    },
                },
            });
            const addressId = safelyParse(addressResponse, 'data.data.id', parseAsString, null);

            if (addressId && creds) {
                const response = await cl.post('/api/customer_addresses', {
                    data: {
                        type: 'customer_addresses',
                        relationships: {
                            customer: {
                                data: {
                                    type: 'customers',
                                    id: creds.commerceId,
                                },
                            },
                            address: {
                                data: {
                                    type: 'addresses',
                                    id: addressId,
                                },
                            },
                        },
                    },
                });
                const status = safelyParse(response, 'status', parseAsNumber, 500);
                const customerAddressId = safelyParse(response, 'data.data.id', parseAsString, null);

                res.status(status).json({ customerAddressId });
            }
        } catch (error) {
            const status = safelyParse(error, 'response.status', parseAsNumber, 500);
            const statusText = safelyParse(error, 'response.statusText', parseAsString, 'Error');
            const message = safelyParse(error, 'response.data.errors', parseAsArrayOfCommerceLayerErrors, null);

            res.status(status).json({ status, statusText, message });
        }

        return Promise.resolve();
    }
}

export default addAddress;
