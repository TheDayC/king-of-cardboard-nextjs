import {
    IAppState,
    Filters,
    Global,
    Checkout,
    CustomerDetails,
    CartState,
    Confirmation,
    PagesState,
    BreaksState,
    AccountState,
    AlertsState,
    ProductsState,
    ImportsState,
} from '../types/state';

export const selectGlobalData = (state: IAppState): Global => state.global;
export const selectProductData = (state: IAppState): ProductsState => state.products;
export const selectCartData = (state: IAppState): CartState => state.cart;
export const selectAlertsData = (state: IAppState): AlertsState => state.alerts;
export const selectFiltersData = (state: IAppState): Filters => state.filters;
export const selectCheckoutData = (state: IAppState): Checkout => state.checkout;
export const selectCheckoutCustomerData = (state: IAppState): CustomerDetails => state.checkout.customerDetails;
export const selectConfirmationData = (state: IAppState): Confirmation => state.confirmation;
export const selectPageData = (state: IAppState): PagesState => state.pages;
export const selectBreaksData = (state: IAppState): BreaksState => state.breaks;
export const selectAccountData = (state: IAppState): AccountState => state.account;
export const selectImportsData = (state: IAppState): ImportsState => state.imports;
