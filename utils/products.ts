import { isArray } from 'lodash';

import { Categories, ProductType } from '../enums/shop';
import { SkuItem, SkuProduct } from '../types/commerce';
import {
    ContentfulProduct,
    ContentfulProductResponse,
    ContentfulProductShort,
    Product,
    SingleProduct,
} from '../types/products';
import { fetchContent } from './content';
import {
    parseAsArrayOfContentfulProducts,
    parseAsArrayOfSkuOptions,
    parseAsArrayOfStrings,
    parseAsImageCollection,
    parseAsImageItem,
    parseAsNumber,
    parseAsSkuInventory,
    parseAsString,
    safelyParse,
} from './parsers';

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
export async function fetchContentfulProducts(
    limit: number,
    skip: number,
    categories: Categories[],
    productTypes: ProductType[]
): Promise<ContentfulProductResponse> {
    // Chain filters, entire object can't be stringified but arrays can for a quick win.
    const where = `types_contains_all: ${JSON.stringify(productTypes)}, categories_contains_all: ${JSON.stringify(
        categories
    )}`;

    // Piece together query.
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

    // On a successful request get the total number of items for pagination.
    const total = safelyParse(productResponse, 'data.content.productCollection.total', parseAsNumber, 0);

    // On success get the item data for products.
    const productCollection = safelyParse(
        productResponse,
        'data.data.productCollection.items',
        parseAsArrayOfContentfulProducts,
        null
    );

    // Return both.
    return {
        total,
        productCollection,
    };
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

export function mergeProductData(products: ContentfulProduct[], skuItems: SkuItem[]): Product[] {
    return products.map((product) => {
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

export function mergeSkuProductData(product: ContentfulProduct, skuItem: SkuItem, skuData: SkuProduct): SingleProduct {
    return {
        id: safelyParse(skuItem, 'id', parseAsString, ''),
        name: safelyParse(product, 'name', parseAsString, ''),
        slug: safelyParse(product, 'slug', parseAsString, ''),
        sku_code: safelyParse(product, 'productLink', parseAsString, null),
        description: safelyParse(product, 'description', parseAsString, null),
        types: safelyParse(product, 'types', parseAsArrayOfStrings, []),
        categories: safelyParse(product, 'categories', parseAsArrayOfStrings, []),
        images: safelyParse(product, 'imageCollection', parseAsImageCollection, null),
        cardImage: safelyParse(product, 'cardImage', parseAsImageItem, null),
        tags: safelyParse(product, 'tags', parseAsArrayOfStrings, null),
        amount: safelyParse(skuData, 'formatted_amount', parseAsString, null),
        compare_amount: safelyParse(skuData, 'formatted_compare_at_amount', parseAsString, null),
        inventory: safelyParse(skuData, 'inventory', parseAsSkuInventory, null),
        options: safelyParse(skuData, 'options', parseAsArrayOfSkuOptions, null),
    };
}
