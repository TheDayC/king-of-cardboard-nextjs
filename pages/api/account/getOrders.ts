import { get } from 'lodash';
import { NextApiRequest, NextApiResponse } from 'next';

import { parseAsNumber, parseAsString, safelyParse } from '../../../utils/parsers';
import { authClient } from '../../../utils/auth';

async function getOrders(req: NextApiRequest, res: NextApiResponse): Promise<void> {
    if (req.method === 'POST') {
        const token = safelyParse(req, 'body.token', parseAsString, null);
        const emailAddress = safelyParse(req, 'body.emailAddress', parseAsString, null);
        const pageSize = safelyParse(req, 'body.pageSize', parseAsString, '5');
        const page = safelyParse(req, 'body.page', parseAsString, '1');
        const include = 'line_items,available_payment_methods,payment_method';
        const orderFields =
            'fields[orders]=number,skus_count,formatted_subtotal_amount,formatted_discount_amount,formatted_shipping_amount,formatted_total_tax_amount,formatted_gift_card_amount,formatted_total_amount_with_taxes,formatted_adjustment_amount,line_items,shipments_count';
        const lineItemFields =
            'fields[line_items]=item_type,image_url,name,sku_code,formatted_unit_amount,quantity,formatted_total_amount';
        const paymentFields = 'fields[payment_methods]=name,payment_source_type';
        const shipmentsFields = 'fields[shipments]=id,status,currency_code,cost_amount_cents';

        const cl = authClient(token);

        return cl
            .get(
                `/api/orders?filter[q][email_eq]=${emailAddress}&page[size]=${pageSize}&page[number]=${page}&include=${include}&${orderFields}&${lineItemFields}&${paymentFields}&${shipmentsFields}`
            )
            .then((response) => {
                const status = safelyParse(response, 'status', parseAsNumber, 500);
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                const { data: orders, included } = get(response, 'data', null);

                res.status(status).json({ orders, included });
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
