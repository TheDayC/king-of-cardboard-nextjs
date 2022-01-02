import { join } from 'lodash';
import { errorHandler } from '../middleware/errors';
import { CartItem, CartTotals } from '../types/cart';
import { ImageItem } from '../types/products';
import { authClient } from './auth';
import {
    parseAsArrayOfCommerceResponse,
    parseAsArrayOfItems,
    parseAsArrayOfStrings,
    parseAsNumber,
    parseAsString,
    safelyParse,
} from './parsers';
import { fetchProductByProductLink, fetchProductImagesByProductLink } from './products';

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
        const fields = 'formatted_subtotal_amount,formatted_shipping_amount,formatted_total_amount_with_taxes';
        const res = await cl.get(`/api/orders/${orderId}?fields[orders]=${fields}`);

        return {
            subTotal: safelyParse(res, 'data.data.attributes.formatted_subtotal_amount', parseAsString, null),
            shipping: safelyParse(res, 'data.data.attributes.formatted_shipping_amount', parseAsString, null),
            total: safelyParse(res, 'data.data.attributes.formatted_total_amount_with_taxes', parseAsString, null),
        };
    } catch (error: unknown) {
        errorHandler(error, 'Failed to fetch cart item count.');
    }

    return {
        subTotal: null,
        shipping: null,
        total: null,
    };
}

export async function getCartItems(accessToken: string, orderId: string): Promise<CartItem[] | null> {
    try {
        const cl = authClient(accessToken);
        const orderFields = 'fields[orders]=id';
        const lineItemFields =
            'fields[line_items]=id,sku_code,name,quantity,formatted_unit_amount,formatted_total_amount,image_url,metadata';
        const res = await cl.get(`/api/orders/${orderId}?include=line_items&${lineItemFields}&${orderFields}`);
        const included = safelyParse(res, 'data.included', parseAsArrayOfCommerceResponse, null);

        if (!included) {
            return null;
        }

        // Here we need to query the skus and stock_items to get a stock quantity.
        const skus = included.map((include) => safelyParse(include, 'attributes.sku_code', parseAsString, ''));
        const skusString = join(skus, ',');

        const skuFields = '&fields[skus]=code,image_url&fields[stock_items]=sku_code,quantity';
        const skuRes = await cl.get(
            `/api/skus/?filter[q][code_in]=${skusString}&filter[q][stock_items_quantity_gt]=0&include=stock_items${skuFields}`
        );
        const skuIncluded = safelyParse(skuRes, 'data.included', parseAsArrayOfCommerceResponse, null);

        if (!skuIncluded) {
            return null;
        }

        const stockWithSkus = skuIncluded.map((include) => ({
            sku_code: safelyParse(include, 'attributes.sku_code', parseAsString, ''),
            stock: safelyParse(include, 'attributes.quantity', parseAsNumber, 0),
        }));

        // Fetch the related cms products by their product link (sku) for their images.
        const cmsProducts = await fetchProductImagesByProductLink(skus);

        return included.map((include) => {
            const sku_code = safelyParse(include, 'attributes.sku_code', parseAsString, '');
            const stockBySku = stockWithSkus.find((s) => s.sku_code === sku_code);
            const stock = safelyParse(stockBySku, 'stock', parseAsNumber, 0);
            const product = cmsProducts ? cmsProducts.find((p) => p.productLink === sku_code) : null;

            return {
                id: safelyParse(include, 'id', parseAsString, ''),
                sku_code,
                name:
                    safelyParse(product, 'name', parseAsString, null) ||
                    safelyParse(include, 'attributes.name', parseAsString, ''),
                quantity: safelyParse(include, 'attributes.quantity', parseAsNumber, 0),
                formatted_unit_amount: safelyParse(include, 'attributes.formatted_unit_amount', parseAsString, ''),
                formatted_total_amount: safelyParse(include, 'attributes.formatted_total_amount', parseAsString, ''),
                image: {
                    title: safelyParse(product, 'cardImage.title', parseAsString, ''),
                    description: safelyParse(product, 'cardImage.description', parseAsString, ''),
                    url: safelyParse(product, 'cardImage.url', parseAsString, ''),
                },
                metadata: {
                    categories: safelyParse(
                        include,
                        'attributes.metadata.categories',
                        parseAsArrayOfStrings,
                        [] as string[]
                    ),
                    types: safelyParse(include, 'attributes.metadata.types', parseAsArrayOfStrings, [] as string[]),
                },
                stock,
            };
        });
    } catch (error: unknown) {
        errorHandler(error, 'Failed to fetch cart items.');
    }

    return null;
}
