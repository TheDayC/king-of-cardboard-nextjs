import { Counties } from '../../enums/checkout';
import { Categories, ProductType } from '../../enums/shop';
import { Order } from '../../types/cart';
import { SkuItem } from '../../types/commerce';
import { ContentfulPage } from '../../types/pages';
import { SocialMedia } from '../../types/profile';

export interface IAppState {
    global: Global;
    products: SkuItem[];
    cart: CartState;
    errors: string | null;
    productType: ProductType[];
    categories: Categories[];
    filters: Filters;
    checkout: Checkout;
    confirmation: Confirmation;
    pages: PagesState;
    shop: ShopState;
    breaks: BreaksState;
    account: AccountState;
}

export interface CartState {
    order: Order | null;
    items: CartItem[];
    paymentMethods: CartPaymentMethod[];
    shouldFetchOrder: boolean;
    isUpdatingCart: boolean;
}

export interface CartItem {
    id: string;
    sku_code: string;
    name: string;
    quantity: number;
    formatted_unit_amount: string;
    formatted_total_amount: string;
    image_url: string;
    metadata: {
        categories: string[];
        types: string[];
    };
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
    checkoutLoading: boolean;
    accessToken: string | null;
    expires: string | null;
    shouldSetNewOrder: boolean;
    shouldFetchRewards: boolean;
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

export interface ShipmentsWithLineItems extends ShipmentsWithMethods {
    lineItems: string[];
}

export interface Confirmation {
    order: Order | null;
    items: CartItem[];
    customerDetails: CustomerDetails;
}

export interface PagesState {
    isLoadingPages: boolean;
    pages: ContentfulPage[];
}

export interface ShopState {
    currentPage: number;
    isLoadingProducts: boolean;
}

export interface BreaksState {
    currentPage: number;
    isLoadingBreaks: boolean;
}

export interface AccountState {
    socialMedia: SocialMedia;
    balance: number;
}
