import { get } from 'lodash';
import { NextApiRequest, NextApiResponse } from 'next';

import { authClient } from '../../utils/auth';

async function updateAddress(req: NextApiRequest, res: NextApiResponse): Promise<void> {
    if (req.method === 'POST') {
        const token = get(req, 'body.token', null);
        const id = get(req, 'body.id', null);
        const personalDetails = get(req, 'body.personalDetails', null);
        const isShipping = get(req, 'body.isShipping', null);
        const cl = authClient(token);

        return cl
            .post('/api/addresses', {
                data: {
                    type: 'addresses',
                    attributes: {
                        first_name: personalDetails.firstName,
                        last_name: personalDetails.lastName,
                        company: personalDetails.company,
                        line_1: isShipping ? personalDetails.shippingAddressLineOne : personalDetails.addressLineOne,
                        line_2: isShipping ? personalDetails.shippingAddressLineTwo : personalDetails.addressLineTwo,
                        city: isShipping ? personalDetails.shippingCity : personalDetails.city,
                        zip_code: isShipping ? personalDetails.shippingPostcode : personalDetails.postcode,
                        state_code: isShipping ? personalDetails.shippingCounty : personalDetails.county,
                        country_code: 'GB',
                        phone: personalDetails.phone,
                    },
                },
            })
            .then((response) => {
                const status = get(response, 'status', 500);
                const { data: addressResponse } = get(response, 'data', null);

                const relationships = isShipping
                    ? {
                          shipping_address: {
                              data: {
                                  type: 'addresses',
                                  id: addressResponse.id,
                              },
                          },
                      }
                    : {
                          billing_address: {
                              data: {
                                  type: 'addresses',
                                  id: addressResponse.id,
                              },
                          },
                      };

                if (addressResponse) {
                    return cl
                        .patch(`/api/orders/${id}`, {
                            data: {
                                type: 'orders',
                                id,
                                attributes: {
                                    customer_email: personalDetails.email,
                                },
                                relationships,
                            },
                        })
                        .then((response) => {
                            const status = get(response, 'status', 500);
                            const { data: addressAssociation } = get(response, 'data', null);

                            res.status(status).json({ hasUpdated: Boolean(addressAssociation) });
                        })
                        .catch((error) => {
                            const status = get(error, 'response.status', 500);
                            const statusText = get(error, 'response.statusText', 'Error');
                            const message = error.response.data.errors
                                ? get(error.response.data.errors[0], 'detail', 'Error')
                                : 'Something went very wrong! Likely a problem connecting to commercelayer.';

                            res.status(status).json({ status, statusText, message });
                        });
                } else {
                    res.status(status).json({ hasUpdated: false });
                }
            })
            .catch((error) => {
                const status = get(error, 'response.status', 500);
                const statusText = get(error, 'response.statusText', 'Error');
                const message = error.response.data.errors
                    ? get(error.response.data.errors[0], 'detail', 'Error')
                    : 'Something went very wrong! Likely a problem connecting to commercelayer.';

                res.status(status).json({ status, statusText, message });
            });
    }
}

export default updateAddress;
