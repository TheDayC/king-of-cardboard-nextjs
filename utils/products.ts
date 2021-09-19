import { ListResponse } from '@commercelayer/sdk/lib/resource';
import { Price } from '@commercelayer/sdk/lib/resources/prices';
import { StockItem } from '@commercelayer/sdk/lib/resources/stock_items';

import { Categories, ProductType } from '../enums/shop';
import { Filters } from '../store/types/state';
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
    stockItems: ListResponse<StockItem>,
    prices: ListResponse<Price>
): Promise<Product[]> {
    return products.map((product) => {
        const { sku } = product;
        const stock = stockItems.find((s) => s.sku_code === sku);
        const price = prices.find((p) => p.sku_code === sku);

        return {
            ...product,
            id: stock && stock.id ? stock.id : '',
            stock: stock && stock.quantity ? stock.quantity : 0,
            price: price && price.amount_cents ? price.amount_cents : 0,
        };
    });
}

export async function fetchProductCollection(
    query: string,
    stockItems: ListResponse<StockItem> | null,
    prices: ListResponse<Price> | null
): Promise<Product[] | null> {
    const productResponse = await fetchContent(query);

    if (productResponse) {
        const productCollection = productResponse.data.data.productCollection;

        if (productCollection) {
            const normalisedCollections = normaliseProductCollection(productCollection.items);

            if (stockItems && prices) {
                const products = hydrateProductCollection(normalisedCollections, stockItems, prices);

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
