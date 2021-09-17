import { IAppState } from '../types/state';
import globalInitialState from './global';
import productsInitialState from './products';
import cartInitialState from './cart';
import errorsInitialState from './errors';
import categoriesInitialState from './categories';
import productTypeInitialState from './productType';
import filtersInitialState from './filters';
import checkoutInitialState from './checkout';

// Function to set our default state.
export function createInitialState(): IAppState {
    return {
        global: globalInitialState,
        products: productsInitialState,
        cart: cartInitialState,
        errors: errorsInitialState,
        categories: categoriesInitialState,
        productType: productTypeInitialState,
        filters: filtersInitialState,
        checkout: checkoutInitialState,
    };
}