import { Filters, Product } from '../store/types/state';

export function filterProducts(products: Product[], filters: Filters): Product[] {
    return products.filter((p) => {
        const someTypes =
            filters.productTypes.length > 0 ? p.types.some((type) => filters.productTypes.includes(type)) : true;
        const someCats =
            filters.categories.length > 0 ? p.categories.some((cat) => filters.categories.includes(cat)) : true;

        if (someTypes && someCats) {
            return true;
        } else {
            return false;
        }
    });
}
