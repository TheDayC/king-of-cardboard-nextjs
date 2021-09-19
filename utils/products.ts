import { Filters, Product } from '../store/types/state';
import { ContentfulProduct } from '../types/products';
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

export function normaliseProductCollection(products: ContentfulProduct[]): Product[] {
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

export async function fetchProductCollection(query: string): Promise<Product[] | null> {
    const productResponse = await fetchContent(query);

    if (productResponse) {
        const productCollection = productResponse.data.data.productCollection;

        if (productCollection) {
            const normalisedCollections = normaliseProductCollection(productCollection.items);

            // TODO: Fetch product with product link and organise into correct data structure.
            return normalisedCollections;
        }
    }

    return null;
}
