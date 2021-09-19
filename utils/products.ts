import { ListResponse } from '@commercelayer/sdk/lib/resource';
import { Price } from '@commercelayer/sdk/lib/resources/prices';
import { StockItem } from '@commercelayer/sdk/lib/resources/stock_items';

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
        id: p.productLink,
        name: p.name,
        price: null,
        stock: null,
        description: p.description.json.content,
        types: null,
        categories: null,
    }));
}

async function hydrateProductCollection(
    products: Product[],
    stockItems: ListResponse<StockItem>,
    prices: ListResponse<Price>
): Promise<Product[]> {
    return products.map((product) => {
        const { id } = product;
        const stock = stockItems.find((s) => s.sku_code === id);
        const price = prices.find((p) => p.sku_code === id);

        return {
            ...product,
            stock: stock && stock.quantity ? stock.quantity : null,
            price: price && price.amount_cents ? price.amount_cents : null,
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
