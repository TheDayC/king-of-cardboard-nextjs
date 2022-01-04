import { isArray, join } from 'lodash';

import { Categories, ProductType } from '../enums/shop';
import { CommerceLayerResponse } from '../types/api';
import { SkuItem, SkuProduct } from '../types/commerce';
import {
    ContentfulProduct,
    ContentfulProductResponse,
    ContentfulProductShort,
    Product,
    SingleProduct,
} from '../types/products';
import { authClient } from './auth';
import { fetchContent } from './content';
import {
    parseAsArrayOfCommerceResponse,
    parseAsArrayOfContentfulProducts,
    parseAsArrayOfSkuOptions,
    parseAsArrayOfStrings,
    parseAsCommerceResponse,
    parseAsImageCollection,
    parseAsImageItem,
    parseAsNumber,
    parseAsSkuInventory,
    parseAsString,
    safelyParse,
} from './parsers';
import { isNotNullOrUndefined } from './typeguards';

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
        case 'breaks':
            return Categories.Breaks;
        default:
            return Categories.Other;
    }
}

/* FETCHING PRODUCTS - NEW */
export async function getProducts(
    accessToken: string,
    limit: number,
    skip: number,
    categories: Categories[],
    productTypes: ProductType[]
): Promise<Product[]> {
    // Chain filters, entire object can't be stringified but arrays can for a quick win.
    const where = `types_contains_all: ${JSON.stringify(productTypes)}, categories_contains_all: ${JSON.stringify(
        categories
    )}`;

    const query = `
        query {
            productCollection (limit: ${limit}, skip: ${skip}, where: {${where}}) {
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
    const cl = authClient(accessToken);

    // On success get the item data for products.
    const productCollection = safelyParse(
        productResponse,
        'data.content.productCollection.items',
        parseAsArrayOfContentfulProducts,
        []
    );

    const sku_codes = productCollection.map((pC) => safelyParse(pC, 'productLink', parseAsString, ''));
    const skuFilter = join(sku_codes, ',');
    const fields = '&fields[skus]=id,code&fields[prices]=sku_code,formatted_amount,formatted_compare_at_amount';
    const res = await cl.get(
        `/api/skus?filter[q][code_in]=${skuFilter}&filter[q][stock_items_quantity_gt]=0&include=prices${fields}`
    );
    const skuItems = safelyParse(res, 'data.data', parseAsArrayOfCommerceResponse, []);
    const included = safelyParse(res, 'data.included', parseAsArrayOfCommerceResponse, []);
    const skusWithStock = skuItems.map((sI) => safelyParse(sI, 'attributes.code', parseAsString, ''));

    // Return both.
    return productCollection
        .filter((pC) => skusWithStock.includes(pC.productLink))
        .map((pC) => {
            const sku_code = safelyParse(pC, 'productLink', parseAsString, '');
            const skuItem =
                skuItems.find((i) => safelyParse(i, 'attributes.code', parseAsString, '') === sku_code) ||
                ({} as CommerceLayerResponse);
            const prices =
                included.find(
                    (i) => i.type === 'prices' && safelyParse(i, 'attributes.sku_code', parseAsString, '') === sku_code
                ) || ({} as CommerceLayerResponse);
            const images = safelyParse(pC, 'imageCollection', parseAsImageCollection, { items: [] });

            return {
                id: safelyParse(skuItem, 'id', parseAsString, ''),
                name: safelyParse(pC, 'name', parseAsString, ''),
                slug: safelyParse(pC, 'slug', parseAsString, ''),
                sku_code,
                description: safelyParse(pC, 'description', parseAsString, ''),
                types: safelyParse(pC, 'types', parseAsArrayOfStrings, []),
                categories: safelyParse(pC, 'categories', parseAsArrayOfStrings, []),
                images: images.items.map((image) => ({
                    title: safelyParse(image, 'title', parseAsString, ''),
                    description: safelyParse(image, 'description', parseAsString, ''),
                    url: safelyParse(image, 'url', parseAsString, ''),
                })),
                cardImage: {
                    title: safelyParse(pC, 'cardImage.title', parseAsString, ''),
                    description: safelyParse(pC, 'cardImage.description', parseAsString, ''),
                    url: safelyParse(pC, 'cardImage.url', parseAsString, ''),
                },
                tags: safelyParse(pC, 'tags', parseAsArrayOfStrings, []),
                amount: safelyParse(prices, 'attributes.formatted_amount', parseAsString, ''),
                compare_amount: safelyParse(prices, 'attributes.formatted_compare_at_amount', parseAsString, ''),
            };
        });
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
    return safelyParse(response, 'data.content.breaksCollection.total', parseAsNumber, 0);
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

export async function fetchProductImagesByProductLink(productLink: string[]): Promise<ContentfulProductShort[] | null> {
    const productQuery = isArray(productLink) ? 'productLink_in' : 'productLink';

    // Piece together query.
    const query = `
        query {
            productCollection (where: {${productQuery}: ${JSON.stringify(productLink)}}) {
                items {
                    name
                    productLink
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

    return productCollection;
}

export function mergeProductData(products: ContentfulProduct[], skuItems: SkuItem[]): Product[] {
    const filteredProducts = products.filter((product) => {
        const { productLink: sku_code } = product;
        const skuItem = skuItems.find((s) => s.sku_code === sku_code) || null;

        return Boolean(skuItem);
    });

    return filteredProducts.map((product) => {
        const { productLink: sku_code } = product;
        const skuItem = skuItems.find((s) => s.sku_code === sku_code) || null;

        return {
            id: safelyParse(skuItem, 'id', parseAsString, null),
            name: safelyParse(product, 'name', parseAsString, null),
            slug: safelyParse(product, 'slug', parseAsString, null),
            sku_code: safelyParse(product, 'productLink', parseAsString, null),
            description: safelyParse(product, 'description', parseAsString, null),
            types: safelyParse(product, 'types', parseAsArrayOfStrings, null),
            categories: safelyParse(product, 'categories', parseAsArrayOfStrings, null),
            images: safelyParse(product, 'imageCollection', parseAsImageCollection, null),
            cardImage: safelyParse(product, 'cardImage', parseAsImageItem, null),
            tags: safelyParse(product, 'tags', parseAsArrayOfStrings, null),
            amount: safelyParse(skuItem, 'amount', parseAsString, null),
            compare_amount: safelyParse(skuItem, 'compare_amount', parseAsString, null),
        };
    });
}

export async function getSingleProduct(accessToken: string, slug: string): Promise<SingleProduct> {
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
    const product = safelyParse(
        productResponse,
        'data.content.productCollection.items',
        parseAsArrayOfContentfulProducts,
        []
    )[0];

    const cl = authClient(accessToken);

    // Need to find the product by SKU first.
    const sku_code = safelyParse(product, 'productLink', parseAsString, '');
    const skuByCodeRes = await cl.get(`/api/skus?filter[q][code_eq]=${sku_code}&fields[skus]=id`);

    const skuByCodeData = safelyParse(skuByCodeRes, 'data.data', parseAsArrayOfCommerceResponse, [])[0];

    // Next pull it by id so we can fetch inventory information.
    const id = safelyParse(skuByCodeData, 'id', parseAsString, '');
    const fields = '&fields[skus]=id,inventory&fields[prices]=sku_code,formatted_amount,formatted_compare_at_amount';
    const skuRes = await cl.get(`/api/skus/${id}?include=prices${fields}`);
    const skuData = safelyParse(skuRes, 'data.data', parseAsCommerceResponse, null);
    const included = safelyParse(skuRes, 'data.included', parseAsArrayOfCommerceResponse, []);
    const prices = included.find((i) => i.attributes.sku_code === sku_code && i.type === 'prices');

    return {
        id,
        name: safelyParse(product, 'name', parseAsString, ''),
        slug: safelyParse(product, 'slug', parseAsString, ''),
        sku_code,
        description: safelyParse(product, 'description', parseAsString, ''),
        types: safelyParse(product, 'types', parseAsArrayOfStrings, []),
        categories: safelyParse(product, 'categories', parseAsArrayOfStrings, []),
        images: safelyParse(product, 'imageCollection', parseAsImageCollection, { items: [] }),
        cardImage: {
            title: safelyParse(product, 'cardImage.title', parseAsString, ''),
            description: safelyParse(product, 'cardImage.description', parseAsString, ''),
            url: safelyParse(product, 'cardImage.url', parseAsString, ''),
        },
        tags: safelyParse(product, 'tags', parseAsArrayOfStrings, []),
        amount: safelyParse(prices, 'attributes.formatted_amount', parseAsString, '£0.00'),
        compare_amount: safelyParse(prices, 'attributes.formatted_compare_at_amount', parseAsString, '£0.00'),
        inventory: safelyParse(skuData, 'attributes.inventory', parseAsSkuInventory, {
            available: false,
            quantity: 0,
            levels: [],
        }),
    };
}
