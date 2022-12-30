import { isArray, join } from 'lodash';
import * as contentful from 'contentful';
import CommerceLayer from '@commercelayer/sdk';

import { Categories, ProductType } from '../enums/shop';
import { CommerceLayerResponse } from '../types/api';
import {
    CartImage,
    ContentfulProduct,
    ContentfulProductShort,
    ProductsWithCount,
    SingleProduct,
} from '../types/products';
import { fetchContent } from './content';
import {
    parseAsArrayOfCommerceResponse,
    parseAsArrayOfContentfulProducts,
    parseAsArrayOfDocuments,
    parseAsArrayOfStrings,
    parseAsCommerceResponse,
    parseAsImageCollection,
    parseAsNumber,
    parseAsSkuInventory,
    parseAsString,
    safelyParse,
} from './parsers';
import { PricesWithSku } from '../types/commerce';

export function parseProductType(type: string): ProductType {
    switch (type) {
        case 'tcg':
            return ProductType.TCG;
        case 'sports':
            return ProductType.Sports;
        default:
            return ProductType.Other;
    }
}

export function parseProductCategory(type: string): Categories {
    switch (type) {
        case 'sealed':
            return Categories.Sealed;
        case 'singles':
            return Categories.Singles;
        case 'packs':
            return Categories.Packs;
        default:
            return Categories.Other;
    }
}

export async function getShallowProducts(
    accessToken: string,
    limit: number,
    skip: number,
    categories: Categories[],
    productTypes: ProductType[]
): Promise<ProductsWithCount> {
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
    const productsRes = await client.getEntries({
        ...typesWhere,
        ...categoriesWhere,
        content_type: 'product',
        limit,
        skip,
        order: '-sys.createdAt',
    });

    // Return early if nothing was found.
    if (productsRes.items.length === 0) {
        return {
            products: [],
            count: 0,
        };
    }

    // Setup a blank prices array with skus to find them later on.
    const prices: PricesWithSku[] = [];

    // Fetch all sku ids for related sku codes.
    const skuCodes = productsRes.items.map((p) => safelyParse(p, 'fields.productLink', parseAsString, ''));

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
            const id = safelyParse(sku, 'id', parseAsString, '');
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
        products: productsRes.items.map(({ fields }) => {
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
                amount: safelyParse(price, 'amount', parseAsString, '£0.00'),
                compareAmount: safelyParse(price, 'compareAmount', parseAsString, '£0.00'),
            };
        }),
        count: safelyParse(productsRes, 'total', parseAsNumber, 0),
    };
}

export async function getProductsTotal(): Promise<number> {
    const query = `
        query {
            productCollection (limit: 1, skip: 0) {
                total
            }
        }
    `;

    // Make the contentful request.
    const response = await fetchContent(query);

    // On a successful request get the total number of items for pagination.
    return safelyParse(response, 'data.content.productCollection.total', parseAsNumber, 0);
}

export async function fetchProductBySlug(slug: string): Promise<ContentfulProduct | null> {
    // Piece together query.
    const query = `
        query {
            productCollection (where: {slug: ${JSON.stringify(slug)}}) {
                total
                items {
                    name
                    slug
                    description
                    productLink
                    types
                    categories
                    imageCollection {
                        items {
                            title
                            description
                            url
                        }
                    }
                    cardImage {
                        title
                        description
                        url
                        width
                        height
                    }
                    tags
                }
            }
        }
    `;

    // Make the contentful request.
    const productResponse = await fetchContent(query);

    // On success get the item data for products.
    const productCollection = safelyParse(
        productResponse,
        'data.content.productCollection.items',
        parseAsArrayOfContentfulProducts,
        null
    );

    if (!productCollection) {
        return null;
    }

    return productCollection[0];
}

export async function fetchProductByProductLink(
    productLink: string[] | string
): Promise<ContentfulProductShort[] | ContentfulProductShort | null> {
    const productQuery = isArray(productLink) ? 'productLink_in' : 'productLink';

    // Piece together query.
    const query = `
        query {
            productCollection (where: {${productQuery}: ${JSON.stringify(productLink)}}) {
                items {
                    name
                    slug
                    productLink
                    types
                    categories
                    cardImage {
                        title
                        description
                        url
                        width
                        height
                    }
                }
            }
        }
    `;

    // Make the contentful request.
    const productResponse = await fetchContent(query);

    // On success get the item data for products.
    const productCollection = safelyParse(
        productResponse,
        'data.content.productCollection.items',
        parseAsArrayOfContentfulProducts,
        null
    );

    if (!productCollection) {
        return null;
    }

    return isArray(productLink) ? productCollection : productCollection[0];
}

export async function fetchProductImagesByProductLink(productLink: string[]): Promise<CartImage[] | null> {
    const productQuery = isArray(productLink) ? 'productLink_in' : 'productLink';
    const cartImages: CartImage[] = [];

    // Piece together query.
    const query = `
        query {
            productCollection (where: {${productQuery}: ${JSON.stringify(productLink)}}) {
                items {
                    productLink
                    cardImage {
                        title
                        description
                        url
                    }
                }
            }
            slotsCollection (where: {${productQuery}: ${JSON.stringify(productLink)}}) {
                items {
                    productLink
                    image {
                        title
                        description
                        url
                    }
                }
            }
            
        }
    `;

    // Make the contentful request.
    const productResponse = await fetchContent(query);

    // On success get the item data for products.
    const productCollection = safelyParse(
        productResponse,
        'data.content.productCollection.items',
        parseAsArrayOfContentfulProducts,
        null
    );

    const slotsCollection = safelyParse(
        productResponse,
        'data.content.slotsCollection.items',
        parseAsArrayOfContentfulProducts,
        null
    );

    if (productCollection) {
        for (const product of productCollection) {
            cartImages.push({
                title: safelyParse(product, 'cardImage.title', parseAsString, ''),
                description: safelyParse(product, 'cardImage.description', parseAsString, ''),
                url: safelyParse(product, 'cardImage.url', parseAsString, ''),
                sku_code: safelyParse(product, 'productLink', parseAsString, ''),
            });
        }
    }

    if (slotsCollection) {
        for (const slot of slotsCollection) {
            cartImages.push({
                title: safelyParse(slot, 'image.title', parseAsString, ''),
                description: safelyParse(slot, 'image.description', parseAsString, ''),
                url: safelyParse(slot, 'image.url', parseAsString, ''),
                sku_code: safelyParse(slot, 'productLink', parseAsString, ''),
            });
        }
    }

    return cartImages;
}
