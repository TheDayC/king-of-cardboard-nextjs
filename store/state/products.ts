import { ProductsState } from '../types/state';

const productsInitialState: ProductsState = {
    currentProduct: {
        id: '',
        name: '',
        slug: '',
        sku_code: '',
        description: '',
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
        options: [],
    },
};

export default productsInitialState;
