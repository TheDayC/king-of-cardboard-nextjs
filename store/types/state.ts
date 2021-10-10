import { Counties } from '../../enums/checkout';
import { Categories, ProductType } from '../../enums/shop';
import { Order } from '../../types/cart';
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
    paymentMethods: CartPaymentMethod[];
    shouldFetchOrder: boolean;
}

export interface CartItem {
    id: string;
    sku_code: string;
    name: string;
    quantity: number;
    formatted_unit_amount: string;
    formatted_total_amount: string;
    image_url: string;
}

export interface CartPaymentMethod {
    id: string;
    name: string;
    payment_source_type: string;
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
    currentStep: number;
    shipmentsWithMethods: ShipmentsWithMethods[] | null;
    customerDetails: CustomerDetails;
}

export interface CustomerDetails {
    email: string | null;
    firstName: string | null;
    lastName: string | null;
    company: string | null;
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

export interface ShipmentsWithMethods {
    shipmentId: string;
    methodId: string;
}
