import CommerceLayer from '@commercelayer/sdk';
import { join, round } from 'lodash';
import * as contentful from 'contentful';

import { Categories, ProductType } from '../enums/shop';
import { ImportsWithCount } from '../types/imports';
import { parseAsArrayOfRepeater, parseAsArrayOfStrings, parseAsNumber, parseAsString, safelyParse } from './parsers';
import { PricesWithSku } from '../types/commerce';
import { Repeater } from '../types/contentful';
import { CartImage } from '../types/products';

export async function getShallowImports(
    accessToken: string,
    limit: number,
    skip: number,
    categories: Categories[],
    productTypes: ProductType[]
): Promise<ImportsWithCount> {
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
        space: process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID || '',
        accessToken: process.env.NEXT_PUBLIC_CONTENTFUL_TOKEN || '',
        environment: process.env.NEXT_PUBLIC_CONTENTFUL_ENV || '',
    });

    // Fetch the contentful products.
    const importsRes = await client.getEntries({
        ...typesWhere,
        ...categoriesWhere,
        content_type: 'import',
        limit,
        skip,
        order: '-sys.createdAt',
    });

    // Return early if nothing was found.
    if (importsRes.items.length === 0) {
        return {
            imports: [],
            count: 0,
        };
    }

    // Setup a blank prices array with skus to find them later on.
    const prices: PricesWithSku[] = [];

    // Fetch all sku ids for related sku codes.
    const skuCodes = importsRes.items.map((i) => safelyParse(i, 'fields.productLink', parseAsString, ''));

    const skus = await cl.skus.list({
        filters: {
            code_in: join(skuCodes, ','),
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
    return {
        imports: importsRes.items.map(({ fields }) => {
            const sku = safelyParse(fields, 'productLink', parseAsString, '');
            const price = prices.find((p) => p.sku === sku);
            const priceRepeater = safelyParse(fields, 'priceHistory', parseAsArrayOfRepeater, [] as Repeater[]);

            return {
                name: safelyParse(fields, 'name', parseAsString, ''),
                slug: safelyParse(fields, 'slug', parseAsString, ''),
                image: {
                    title: safelyParse(fields, 'cardImage.fields.title', parseAsString, ''),
                    description: safelyParse(fields, 'cardImage.fields.description', parseAsString, ''),
                    url: safelyParse(fields, 'cardImage.fields.file.url', parseAsString, ''),
                },
                tags: safelyParse(fields, 'tags', parseAsArrayOfStrings, []),
                amount: safelyParse(price, 'amount', parseAsString, '£0.00'),
                compareAmount: safelyParse(price, 'compareAmount', parseAsString, '£0.00'),
                priceHistory: priceRepeater.map((r) => ({
                    timestamp: safelyParse(r, 'key', parseAsString, ''),
                    amount: safelyParse(r, 'value', parseAsString, ''),
                })),
            };
        }),
        count: safelyParse(importsRes, 'total', parseAsNumber, 0),
    };
}

export function getPercentageChange(previous: number, current: number): number {
    const decreaseValue = current - previous;

    return round((decreaseValue / previous) * 100, 2);
}

export async function fetchImportImagesWithProductLink(skuCodes: string[]): Promise<CartImage[]> {
    const client = contentful.createClient({
        space: process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID || '',
        accessToken: process.env.NEXT_PUBLIC_CONTENTFUL_TOKEN || '',
        environment: process.env.NEXT_PUBLIC_CONTENTFUL_ENV || '',
    });

    const importsRes = await client.getEntries({
        'fields.productLink[in]': join(skuCodes, ','),
        content_type: 'import',
        limit: 1,
        skip: 0,
        order: '-sys.createdAt',
    });

    return importsRes.items.map(({ fields }) => ({
        sku_code: safelyParse(fields, 'productLink', parseAsString, ''),
        title: safelyParse(fields, 'cardImage.fields.title', parseAsString, ''),
        description: safelyParse(fields, 'cardImage.fields.description', parseAsString, ''),
        url: `https:${safelyParse(fields, 'cardImage.fields.file.url', parseAsString, '')}`,
    }));
}
