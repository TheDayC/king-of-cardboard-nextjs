import { get } from 'lodash';

import { Categories, ProductType } from '../enums/shop';
import { Filters } from '../store/types/state';
import { SkuItem } from '../types/commerce';
import { ContentfulProduct, ContentfulProductResponse, Product } from '../types/products';
import { fetchContent } from './content';

export function filterProducts(products: Product[], filters: Filters): Product[] {
    return products.filter((p) => {
        const someTypes =
            filters.productTypes.length > 0 && p.types
                ? p.types.some((type) => filters.productTypes.includes(type))
                : true;
        const someCats =
            filters.categories.length > 0 && p.categories
                ? p.categories.some((cat) => filters.categories.includes(cat))
                : true;

        if (someTypes && someCats) {
            return true;
        } else {
            return false;
        }
    });
}

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
export async function fetchContentfulProducts(limit: number, skip: number): Promise<ContentfulProductResponse> {
    const query = `
        query {
            productCollection (limit: ${limit}, skip: ${skip}) {
                total
                items {
                    name
                    slug
                    description {
                        json
                    }
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

    const productResponse = await fetchContent(query);

    if (productResponse) {
        const total: number = get(productResponse, 'data.data.productCollection.total', 0);
        const productCollection: ContentfulProduct[] | null = get(
            productResponse,
            'data.data.productCollection.items',
            null
        );

        return {
            total,
            productCollection,
        };
    }

    return { total: 0, productCollection: null };
}

export function mergeProductData(products: ContentfulProduct[], skuItems: SkuItem[]): Product[] {
    return products.map((product) => {
        const { productLink: sku_code } = product;
        const skuItem = skuItems.find((s) => s.sku_code === sku_code) || null;

        return {
            name: get(product, 'name', ''),
            slug: get(product, 'slug', ''),
            sku_code: get(product, 'productLink', null),
            description: get(product, 'description', null),
            types: get(product, 'types', []),
            categories: get(product, 'categories', []),
            images: get(product, 'imageCollection', null),
            cardImage: get(product, 'cardImage', null),
            tags: get(product, 'tags', null),
            amount: get(skuItem, 'amount', ''),
            compare_amount: get(skuItem, 'compare_amount', ''),
        };
    });
}
