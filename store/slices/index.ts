import { combineReducers } from '@reduxjs/toolkit';

import { IAppState } from '../types/state';
import globalReducer from './global';
import productsReducer from './products';
import cartReducer from './cart';
import errorsReducer from './errors';
import categoriesReducer from './categories';
import productTypeReducer from './productType';
import filtersReducer from './filters';
import checkoutReducer from './checkout';

const rootReducer = combineReducers<IAppState>({
    global: globalReducer,
    products: productsReducer,
    cart: cartReducer,
    errors: errorsReducer,
    categories: categoriesReducer,
    productType: productTypeReducer,
    filters: filtersReducer,
    checkout: checkoutReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
