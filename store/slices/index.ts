import { combineReducers } from '@reduxjs/toolkit';

import { AppStateShape } from '../types/state';
import globalReducer from './global';
import productsReducer from './products';
import cartReducer from './cart';
import alertsReducer from './alerts';
import filtersReducer from './filters';
import checkoutReducer from './checkout';
import confirmationReducer from './confirmation';
import pagesReducer from './pages';
import breaksReducer from './breaks';
import accountReducer from './account';

const rootReducer = combineReducers<AppStateShape>({
    global: globalReducer,
    products: productsReducer,
    cart: cartReducer,
    alerts: alertsReducer,
    filters: filtersReducer,
    checkout: checkoutReducer,
    confirmation: confirmationReducer,
    pages: pagesReducer,
    breaks: breaksReducer,
    account: accountReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
