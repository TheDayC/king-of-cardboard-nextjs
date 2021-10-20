import { get } from 'lodash';

import { Categories, ProductType } from '../enums/shop';
import { Filters } from '../store/types/state';
import { Price, SkuItem, StockItem } from '../types/commerce';
import { ContentfulProduct, Product } from '../types/products';
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

function normaliseProductCollection(products: ContentfulProduct[]): Product[] {
    return products.map((p) => {
        const content = get(p, 'description.json.content', '');
        const types = get(p, 'types', []);
        const categories = get(p, 'categories', []);
        const images = get(p, 'imageCollection.items', []);

        return {
            id: '',
            sku: p.productLink,
            name: p.name,
            slug: p.slug,
            price: {
                formatted_amount: '',
                currency_code: '',
                amount_float: 0,
                amount_cents: 0,
            },
            stock: 0,
            description: content,
            types: types.map((type) => parseProductType(type)),
            categories: categories.map((cat) => parseProductCategory(cat)),
            images,
        };
    });
}

export async function fetchProductCollection(
    query: string,
    stockItems: StockItem[] | null,
    prices: Price[] | null
): Promise<Product[] | null> {
    const productResponse = await fetchContent(query);

    if (productResponse) {
        const productCollection: ContentfulProduct[] | null = get(
            productResponse,
            'data.data.productCollection.items',
            null
        );

        if (productCollection) {
            const normalisedCollections = normaliseProductCollection(productCollection);

            if (stockItems && prices) {
                const products = await hydrateProductCollection(normalisedCollections, stockItems, prices);

                return products;
            }

            return normalisedCollections;
        }
    }

    return null;
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
export async function fetchContentfulProducts(limit: number, skip: number): Promise<ContentfulProduct[] | null> {
    const query = `
        query {
            productCollection (limit: ${limit}, skip: ${skip}) {
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
                }
            }
        }
    `;

    const productResponse = await fetchContent(query);

    if (productResponse) {
        const productCollection: ContentfulProduct[] | null = get(
            productResponse,
            'data.data.productCollection.items',
            null
        );

        if (productCollection) {
            return productCollection;
            //return normaliseProductCollection(productCollection);
        }

        return null;
    }

    return null;
}

export function mergeProductData(products: ContentfulProduct[], skuItems: SkuItem[]): Product[] {
    return products.map((product) => {
        const { productLink: sku_code } = product;
        const skuItem = skuItems.find((s) => s.sku_code === sku_code) || null;

        return {
            name: get(product, 'name', ''),
            slug: get(product, 'slug', ''),
            description: get(product, 'description', null),
            sku_code: get(product, 'productLink', null),
            types: get(product, 'types', []),
            categories: get(product, 'categories', []),
            images: get(product, 'imageCollection', null),
            cardImage: get(product, 'cardImage', null),
            amount: get(skuItem, 'amount', ''),
            compare_amount: get(skuItem, 'compare_amount', ''),
        };
    });
}
