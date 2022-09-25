import { join } from 'lodash';
import CommerceLayer from '@commercelayer/sdk';

import { errorHandler } from '../middleware/errors';
import { CartItem, CartTotals } from '../types/cart';
import { authClient } from './auth';
import { parseAsArrayOfStrings, parseAsNumber, parseAsString, safelyParse } from './parsers';
import { fetchProductImagesByProductLink } from './products';
import { fetchImportImagesWithProductLink } from './imports';

export async function getItemCount(accessToken: string, orderId: string): Promise<number> {
    try {
        const cl = authClient(accessToken);
        const res = await cl.get(`/api/orders/${orderId}?fields[orders]=skus_count`);

        return safelyParse(res, 'data.data.attributes.skus_count', parseAsNumber, 0);
    } catch (error: unknown) {
        errorHandler(error, 'Failed to fetch cart item count.');
    }

    return 0;
}

export async function getCartTotals(accessToken: string, orderId: string): Promise<CartTotals> {
    try {
        const cl = authClient(accessToken);
        const fields =
            'formatted_subtotal_amount,formatted_shipping_amount,formatted_total_amount_with_taxes,formatted_gift_card_amount';
        const res = await cl.get(`/api/orders/${orderId}?fields[orders]=${fields}`);

        return {
            subTotal: safelyParse(res, 'data.data.attributes.formatted_subtotal_amount', parseAsString, '£0.00'),
            shipping: safelyParse(res, 'data.data.attributes.formatted_shipping_amount', parseAsString, '£0.00'),
            discount: safelyParse(res, 'data.data.attributes.formatted_gift_card_amount', parseAsString, '£0.00'),
            total: safelyParse(res, 'data.data.attributes.formatted_total_amount_with_taxes', parseAsString, '£0.00'),
        };
    } catch (error: unknown) {
        errorHandler(error, 'Failed to fetch cart item count.');
    }

    return {
        subTotal: '£0.00',
        shipping: '£0.00',
        discount: '£0.00',
        total: '£0.00',
    };
}

export async function getCartItems(
    accessToken: string,
    orderId: string,
    isImport: boolean = false
): Promise<CartItem[]> {
    try {
        const cl = CommerceLayer({
            organization: process.env.NEXT_PUBLIC_ECOM_SLUG || '',
            accessToken,
        });

        const order = await cl.orders.retrieve(orderId, {
            fields: {
                orders: ['id', 'line_items'],
                line_items: [
                    'id',
                    'sku_code',
                    'name',
                    'quantity',
                    'formatted_unit_amount',
                    'formatted_total_amount',
                    'image_url',
                    'metadata',
                    'line_item_options',
                ],
                line_item_options: ['id', 'name', 'formatted_total_amount', 'quantity'],
            },
            include: ['line_items', 'line_items.line_item_options'],
        });

        // Here we need to query the skus and stock_items to get a stock quantity.
        const lineItems = order.line_items ? order.line_items : [];
        const skuCodes = order.line_items
            ? order.line_items.map((item) => safelyParse(item, 'sku_code', parseAsString, ''))
            : [];

        const skus = await cl.skus.list({
            filters: {
                code_in: join(skuCodes, ','),
                stock_items_quantity_gt: 0,
            },
            fields: {
                skus: ['code', 'image_url', 'stock_items'],
                stock_items: ['sku_code', 'quantity'],
            },
            include: ['stock_items'],
        });

        // Fetch the related cms products by their product link (sku) for their images.
        const cmsProducts = await fetchProductImagesByProductLink(skuCodes);
        const cmsImports = await fetchImportImagesWithProductLink(skuCodes);

        return lineItems.map((lineItem) => {
            const sku_code = safelyParse(lineItem, 'sku_code', parseAsString, '');
            const skuItem = skus.find((skuItem) => skuItem.code === sku_code);
            const stockItem =
                skuItem && skuItem.stock_items
                    ? skuItem.stock_items.find((stockItem) => stockItem.sku_code === sku_code) || null
                    : null;
            const product = cmsProducts ? cmsProducts.find((p) => p.sku_code === sku_code) : null;
            const singleImport = cmsImports ? cmsImports.find((p) => p.sku_code === sku_code) : null;
            const chosenCmsItem = product || singleImport;

            return {
                id: safelyParse(lineItem, 'id', parseAsString, ''),
                sku_code,
                name:
                    safelyParse(chosenCmsItem, 'name', parseAsString, null) ||
                    safelyParse(lineItem, 'name', parseAsString, ''),
                quantity: safelyParse(lineItem, 'quantity', parseAsNumber, 0),
                formatted_unit_amount: safelyParse(lineItem, 'formatted_unit_amount', parseAsString, ''),
                formatted_total_amount: safelyParse(lineItem, 'formatted_total_amount', parseAsString, ''),
                image: {
                    title: safelyParse(chosenCmsItem, 'title', parseAsString, ''),
                    description: safelyParse(chosenCmsItem, 'description', parseAsString, ''),
                    url: safelyParse(chosenCmsItem, 'url', parseAsString, ''),
                },
                metadata: {
                    categories: safelyParse(lineItem, 'attributes.metadata.categories', parseAsArrayOfStrings, []),
                    types: safelyParse(lineItem, 'attributes.metadata.types', parseAsArrayOfStrings, []),
                },
                stock: safelyParse(stockItem, 'quantity', parseAsNumber, 0),
                line_item_options: lineItem.line_item_options || [],
            };
        });
    } catch (error: unknown) {
        errorHandler(error, 'Failed to fetch cart items.');
    }

    return [];
}
