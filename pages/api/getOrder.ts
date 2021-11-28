import { get, join } from 'lodash';
import { NextApiRequest, NextApiResponse } from 'next';

import { authClient } from '../../utils/auth';

async function getOrder(req: NextApiRequest, res: NextApiResponse): Promise<void> {
    if (req.method === 'POST') {
        const token = get(req, 'body.token', null);
        const orderId = get(req, 'body.id', null);
        const include = get(req, 'body.include', null);
        const cl = authClient(token);
        const includeJoin = join(include, ',');
        const orderFields =
            'fields[orders]=number,skus_count,formatted_subtotal_amount,formatted_discount_amount,formatted_shipping_amount,formatted_total_tax_amount,formatted_gift_card_amount,formatted_total_amount_with_taxes,line_items,shipments_count,status,payment_status,fulfillment_status';
        const lineItemFields =
            'fields[line_items]=item_type,image_url,name,sku_code,formatted_unit_amount,quantity,formatted_total_amount,metadata';
        const paymentFields = 'fields[payment_methods]=id,name,payment_source_type';
        const shipmentsFields = 'fields[shipments]=id,status,currency_code,cost_amount_cents';

        const apiUrl = include
            ? `/api/orders/${orderId}?include=${includeJoin}&${orderFields}&${lineItemFields}&${paymentFields}&${shipmentsFields}`
            : `/api/orders/${orderId}`;

        return cl
            .get(apiUrl)
            .then((response) => {
                const status = get(response, 'status', 500);
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                const { data: order, included } = get(response, 'data', null);

                res.status(status).json({ order, included });
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

export default getOrder;
