import { Order } from '@commercelayer/sdk/lib/resources/orders';

import { Counties } from '../../enums/checkout';
import { Categories, ProductType } from '../../enums/shop';
import { Product } from '../../types/products';

export interface IAppState {
    global: Global;
    products: Product[];
    cart: CartState;
    errors: string | null;
    productType: ProductType[];
    categories: Categories[];
    filters: Filters;
    checkout: Checkout;
}

export interface CartState {
    order: Order | null;
    items: CartItem[];
    shouldFetchOrder: boolean;
}

export interface CartItem {
    id: string;
    stock: number;
}

export interface Filters {
    productTypes: ProductType[];
    categories: Categories[];
}

export interface Global {
    loading: boolean;
    accessToken: string | null;
    expires: string | null;
}

export interface Checkout {
    subTotal: number;
    taxes: number;
    total: number;
    taxRate: number;
    currentStep: number;
    shippingMethod: string | null;
    customerDetails: CustomerDetails;
}

export interface CustomerDetails {
    email: string | null;
    firstName: string | null;
    lastName: string | null;
    addressLineOne: string | null;
    addressLineTwo: string | null;
    city: string | null;
    postcode: string | null;
    county: Counties | null;
    phone: string | null;
    allowShippingAddress: boolean;
    shippingAddressLineOne: string | null;
    shippingAddressLineTwo: string | null;
    shippingCity: string | null;
    shippingPostcode: string | null;
    shippingCounty: Counties | null;
}
