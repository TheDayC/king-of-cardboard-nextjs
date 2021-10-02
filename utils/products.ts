import { get } from 'lodash';

import { Categories, ProductType } from '../enums/shop';
import { Filters } from '../store/types/state';
import { Price, StockItem } from '../types/commerce';
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
    return products.map((p) => ({
        id: '',
        sku: p.productLink,
        name: p.name,
        price: 0,
        stock: 0,
        description: p.description.json.content,
        types: p.types.map((type) => parseProductType(type)),
        categories: p.categories.map((cat) => parseProductCategory(cat)),
        images: p.imageCollection.items,
    }));
}

async function hydrateProductCollection(
    products: Product[],
    stockItems: StockItem[],
    prices: Price[]
): Promise<Product[]> {
    return products.map((product) => {
        const { sku } = product;
        const stock = stockItems.find((s) => s.attributes.sku_code === sku);
        const price = prices.find((p) => p.attributes.sku_code === sku);

        return {
            ...product,
            id: stock && stock.id ? stock.id : '',
            stock: stock && stock.attributes.quantity ? stock.attributes.quantity : 0,
            price: price && price.attributes.amount_cents ? price.attributes.amount_cents : 0,
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
