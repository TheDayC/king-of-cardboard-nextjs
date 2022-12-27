import { CustomerDetails } from '../../types/checkout';
import {
    AppStateShape,
    Filters,
    Global,
    Checkout,
    CartState,
    Confirmation,
    PagesState,
    BreaksState,
    AccountState,
    AlertsState,
    ProductsState,
} from '../types/state';

export const selectGlobalData = (state: AppStateShape): Global => state.global;
export const selectProductData = (state: AppStateShape): ProductsState => state.products;
export const selectCartData = (state: AppStateShape): CartState => state.cart;
export const selectAlertsData = (state: AppStateShape): AlertsState => state.alerts;
export const selectFiltersData = (state: AppStateShape): Filters => state.filters;
export const selectCheckoutData = (state: AppStateShape): Checkout => state.checkout;
export const selectCheckoutCustomerData = (state: AppStateShape): CustomerDetails => state.checkout.customerDetails;
export const selectConfirmationData = (state: AppStateShape): Confirmation => state.confirmation;
export const selectPageData = (state: AppStateShape): PagesState => state.pages;
export const selectBreaksData = (state: AppStateShape): BreaksState => state.breaks;
export const selectAccountData = (state: AppStateShape): AccountState => state.account;
