import { Counties } from '../../enums/checkout';
import { Categories, ProductType } from '../../enums/shop';

export interface IAppState {
    global: Global;
    products: Product[];
    cart: CartItem[];
    errors: string | null;
    productType: ProductType[];
    categories: Categories[];
    filters: Filters;
    checkout: Checkout;
}

export interface Product {
    id: number;
    name: string;
    price: number;
    stock: number;
    description: string;
    types: ProductType[];
    categories: Categories[];
}

export interface CartItem {
    id: number;
    amount: number;
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
