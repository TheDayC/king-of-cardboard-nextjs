import { ProductsState } from '../types/state';

const productsInitialState: ProductsState = {
    products: [],
    productsTotal: 0,
    isLoadingProducts: false,
};

export default productsInitialState;
