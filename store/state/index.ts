import { IAppState } from '../types/state';
import globalInitialState from './global';
import productsInitialState from './products';
import cartInitialState from './cart';
import alertsInitialState from './alerts';
import filtersInitialState from './filters';
import checkoutInitialState from './checkout';
import confirmationInitialState from './confirmation';
import pagesInitialState from './pages';
import breaksInitialState from './breaks';
import accountInitialState from './account';

// Function to set our default state.
export function createInitialState(): IAppState {
    return {
        global: globalInitialState,
        products: productsInitialState,
        cart: cartInitialState,
        alerts: alertsInitialState,
        filters: filtersInitialState,
        checkout: checkoutInitialState,
        confirmation: confirmationInitialState,
        pages: pagesInitialState,
        breaks: breaksInitialState,
        account: accountInitialState,
    };
}
