import CommerceLayer from '@commercelayer/sdk';
import { join } from 'lodash';
import * as contentful from 'contentful';

import { Categories, ProductType } from '../enums/shop';
import { ShallowImport } from '../types/imports';
import { parseAsArrayOfStrings, parseAsString, safelyParse } from './parsers';
import { PricesWithSku } from '../types/commerce';

export async function getShallowImports(
    accessToken: string,
    limit: number,
    skip: number,
    categories: Categories[],
    productTypes: ProductType[]
): Promise<ShallowImport[]> {
    // Build where queries.
    const typesWhere = productTypes.length
        ? {
              'fields.types[in]': join(productTypes, ','),
          }
        : {};
    const categoriesWhere = categories.length
        ? {
              'fields.categories[in]': join(categories, ','),
          }
        : {};

    // Create the commerce layer and contenful clients.
    const cl = CommerceLayer({
        organization: process.env.NEXT_PUBLIC_ECOM_SLUG || '',
        accessToken,
    });

    const client = contentful.createClient({
        space: process.env.CONTENTFUL_SPACE_ID || '',
        accessToken: process.env.CONTENTFUL_TOKEN || '',
        environment: process.env.CONTENTFUL_ENV || '',
    });

    // Fetch the contentful products.
    const importsRes = await client.getEntries({
        ...typesWhere,
        ...categoriesWhere,
        content_type: 'import',
        limit,
        skip,
        order: 'sys.createdAt',
    });

    // Return early if nothing was found.
    if (importsRes.items.length === 0) {
        return [];
    }

    // Setup a blank prices array with skus to find them later on.
    const prices: PricesWithSku[] = [];

    // Fetch all sku ids for related sku codes.
    const skuCodes = importsRes.items.map((i) => safelyParse(i, 'fields.productLink', parseAsString, ''));

    const skus = await cl.skus.list({
        filters: {
            code: join(skuCodes, ','),
        },
        fields: {
            skus: ['id', 'code'],
        },
    });

    // Loop over the sku ids so we can fetch their price relationships.
    for (const sku of skus) {
        const code = safelyParse(sku, 'code', parseAsString, null);

        if (code) {
            const id = safelyParse(skus[0], 'id', parseAsString, '');
            const clPrices = await cl.skus.prices(id, {
                fields: ['formatted_amount', 'formatted_compare_at_amount'],
            });

            prices.push({
                sku: code,
                amount: safelyParse(clPrices[0], 'formatted_amount', parseAsString, ''),
                compareAmount: safelyParse(clPrices[0], 'formatted_compare_at_amount', parseAsString, ''),
            });
        }
    }

    // Return custom imports structure.
    return importsRes.items.map(({ fields }) => {
        const sku = safelyParse(fields, 'productLink', parseAsString, '');
        const price = prices.find((p) => p.sku === sku);

        return {
            name: safelyParse(fields, 'name', parseAsString, ''),
            slug: safelyParse(fields, 'slug', parseAsString, ''),
            image: {
                title: safelyParse(fields, 'cardImage.fields.title', parseAsString, ''),
                description: safelyParse(fields, 'cardImage.fields.description', parseAsString, ''),
                url: safelyParse(fields, 'cardImage.fields.file.url', parseAsString, ''),
            },
            tags: safelyParse(fields, 'tags', parseAsArrayOfStrings, []),
            amount: safelyParse(price, 'formatted_amount', parseAsString, '£0.00'),
            compareAmount: safelyParse(price, 'formatted_compare_at_amount', parseAsString, '£0.00'),
        };
    });
}
