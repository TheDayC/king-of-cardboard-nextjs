import { ProductsState } from '../types/state';

const productsInitialState: ProductsState = {
    products: [],
    productsTotal: 0,
    isLoadingProducts: false,
    currentProduct: {
        id: '',
        name: '',
        slug: '',
        sku_code: '',
        description: null,
        types: [],
        categories: [],
        images: {
            items: [],
        },
        cardImage: {
            title: '',
            description: '',
            url: '',
        },
        tags: [],
        amount: '',
        compare_amount: '',
        inventory: {
            available: false,
            quantity: 0,
            levels: [],
        },
    },
};

export default productsInitialState;
