import { get } from 'lodash';
import { NextApiRequest, NextApiResponse } from 'next';

import { parseAsNumber, parseAsString, safelyParse } from '../../../utils/parsers';
import { authClient } from '../../../utils/auth';

async function getHistoricalOrders(req: NextApiRequest, res: NextApiResponse): Promise<void> {
    if (req.method === 'POST') {
        const token = safelyParse(req, 'body.token', parseAsString, null);
        const emailAddress = safelyParse(req, 'body.emailAddress', parseAsString, null);
        const orderNumber = safelyParse(req, 'body.orderNumber', parseAsString, null);

        const filters = `filter[q][number_eq]=${orderNumber}&filter[q][email_eq]=${emailAddress}`;
        const orderFields =
            'fields[orders]=number,status,payment_status,fulfillment_status,skus_count,formatted_total_amount,formatted_subtotal_amount,formatted_shipping_amount,formatted_discount_amount,shipments_count,placed_at,updated_at,line_items,shipping_address,billing_address,payment_source_details';
        const include = 'line_items,shipping_address,billing_address,shipments';
        const lineItemFields = 'fields[line_items]=id,sku_code,image_url,quantity';
        const addressFields =
            'fields[addresses]=id,name,first_name,last_name,company,line_1,line_2,city,zip_code,state_code,country_code,phone';
        const shipmentFields = 'fields[shipments]=id,number,status,formatted_cost_amount';

        const cl = authClient(token);

        return cl
            .get(
                `/api/orders?${filters}&${orderFields}&include=${include}&${lineItemFields}&${addressFields}&${shipmentFields}`
            )
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

export default getHistoricalOrders;
