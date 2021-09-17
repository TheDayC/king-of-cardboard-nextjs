import { Categories, ProductType } from '../../enums/shop';
import { IAppState, Product, CartItem, Filters, Global, Checkout, CustomerDetails } from '../types/state';

export const selectGlobalData = (state: IAppState): Global => state.global;
export const selectProductData = (state: IAppState): Product[] => state.products;
export const selectCartData = (state: IAppState): CartItem[] => state.cart;
export const selectErrorData = (state: IAppState): string | null => state.errors;
export const selectCategoryData = (state: IAppState): Categories[] => state.categories;
export const selectProductTypeData = (state: IAppState): ProductType[] => state.productType;
export const selectFiltersData = (state: IAppState): Filters => state.filters;
export const selectCheckoutData = (state: IAppState): Checkout => state.checkout;
export const selectCheckoutCustomerData = (state: IAppState): CustomerDetails => state.checkout.customerDetails;
