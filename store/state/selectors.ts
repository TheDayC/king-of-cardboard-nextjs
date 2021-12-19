import { Categories, ProductType } from '../../enums/shop';
import { SkuItem } from '../../types/commerce';
import {
    IAppState,
    Filters,
    Global,
    Checkout,
    CustomerDetails,
    CartState,
    Confirmation,
    PagesState,
    ShopState,
    BreaksState,
    AccountState,
    ErrorsState,
} from '../types/state';

export const selectGlobalData = (state: IAppState): Global => state.global;
export const selectProductData = (state: IAppState): SkuItem[] => state.products;
export const selectCartData = (state: IAppState): CartState => state.cart;
export const selectErrorData = (state: IAppState): ErrorsState => state.errors;
export const selectCategoryData = (state: IAppState): Categories[] => state.categories;
export const selectProductTypeData = (state: IAppState): ProductType[] => state.productType;
export const selectFiltersData = (state: IAppState): Filters => state.filters;
export const selectCheckoutData = (state: IAppState): Checkout => state.checkout;
export const selectCheckoutCustomerData = (state: IAppState): CustomerDetails => state.checkout.customerDetails;
export const selectConfirmationData = (state: IAppState): Confirmation => state.confirmation;
export const selectPageData = (state: IAppState): PagesState => state.pages;
export const selectShopData = (state: IAppState): ShopState => state.shop;
export const selectBreaksData = (state: IAppState): BreaksState => state.breaks;
export const selectAccountData = (state: IAppState): AccountState => state.account;
