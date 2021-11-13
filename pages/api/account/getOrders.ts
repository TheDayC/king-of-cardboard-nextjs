import { get } from 'lodash';
import { NextApiRequest, NextApiResponse } from 'next';

import { parseAsNumber, parseAsString, safelyParse } from '../../../utils/parsers';
import { authClient } from '../../../utils/auth';

async function getOrders(req: NextApiRequest, res: NextApiResponse): Promise<void> {
    if (req.method === 'POST') {
        const token = safelyParse(req, 'body.token', parseAsString, null);
        const emailAddress = safelyParse(req, 'body.emailAddress', parseAsString, null);
        const pageSize = safelyParse(req, 'body.pageSize', parseAsNumber, 5);
        const page = safelyParse(req, 'body.page', parseAsNumber, 1);

        const filters = `filter[q][email_eq]=${emailAddress}&filter[q][status_not_in]=draft,pending`;
        const pagination = `page[size]=${pageSize}&page[number]=${page}`;
        const sort = 'sort=-created_at,number';
        const orderFields =
            'fields[orders]=number,status,payment_status,fulfillment_status,skus_count,formatted_total_amount_with_taxes,shipments_count,placed_at,updated_at';
        const include = 'line_items';
        const lineItemFields = 'fields[line_items]=id,sku_code,image_url,quantity';

        const cl = authClient(token);

        return cl
            .get(`/api/orders?${filters}&${sort}&${pagination}&${orderFields}&include=${include}&${lineItemFields}`)
            .then((response) => {
                const status = safelyParse(response, 'status', parseAsNumber, 500);
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                const { data: orders, included, meta } = get(response, 'data', null);

                res.status(status).json({ orders, included, meta });
            })
            .catch((error) => {
                const status = safelyParse(error, 'response.status', parseAsNumber, 500);
                const statusText = safelyParse(error, 'response.statusText', parseAsString, 'Error');
                const message = error.response.data.errors
                    ? get(error.response.data.errors[0], 'detail', 'Error')
                    : 'Something went very wrong! Likely a problem connecting to commercelayer.';

                res.status(status).json({ status, statusText, message });
            });
    }
}

export default getOrders;
