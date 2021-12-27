import { combineReducers } from '@reduxjs/toolkit';

import { IAppState } from '../types/state';
import globalReducer from './global';
import productsReducer from './products';
import cartReducer from './cart';
import alertsReducer from './alerts';
import categoriesReducer from './categories';
import productTypeReducer from './productType';
import filtersReducer from './filters';
import checkoutReducer from './checkout';
import confirmationReducer from './confirmation';
import pagesReducer from './pages';
import shopReducer from './shop';
import breaksReducer from './breaks';
import accountReducer from './account';

const rootReducer = combineReducers<IAppState>({
    global: globalReducer,
    products: productsReducer,
    cart: cartReducer,
    alerts: alertsReducer,
    categories: categoriesReducer,
    productType: productTypeReducer,
    filters: filtersReducer,
    checkout: checkoutReducer,
    confirmation: confirmationReducer,
    pages: pagesReducer,
    shop: shopReducer,
    breaks: breaksReducer,
    account: accountReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
