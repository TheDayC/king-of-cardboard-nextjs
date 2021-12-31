import { DateTime } from 'luxon';

import { Counties } from '../../enums/checkout';
import { Categories, ProductType } from '../../enums/shop';
import { AlertLevel } from '../../enums/system';
import { Order } from '../../types/cart';
import { BillingAddress, ShippingAddress } from '../../types/checkout';
import { SkuItem } from '../../types/commerce';
import { ContentfulPage } from '../../types/pages';
import { SocialMedia } from '../../types/profile';

export interface IAppState {
    global: Global;
    products: SkuItem[];
    cart: CartState;
    alerts: AlertsState;
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
    shouldShowDrawer: boolean;
}

export interface Checkout {
    currentStep: number;
    shipmentsWithMethods: ShipmentsWithMethods[] | null;
    customerDetails: CustomerDetails;
    billingAddress: CustomerAddress;
    shippingAddress: CustomerAddress;
    cloneBillingAddressId: string | null;
    cloneShippingAddressId: string | null;
    isShippingSameAsBilling: boolean;
}

export interface CustomerDetails {
    email: string | null;
    first_name: string | null;
    last_name: string | null;
    phone: string | null;
}

export interface CustomerAddress {
    id: string | null;
    billing_info: string | null;
    business: boolean;
    city: string | null;
    company: string | null;
    country_code: string | null;
    email: string | null;
    first_name: string | null;
    full_address: string | null;
    full_name: string | null;
    is_geocoded: boolean;
    is_localized: boolean;
    last_name: string | null;
    lat: number | null;
    line_1: string | null;
    line_2: string | null;
    lng: number | null;
    map_url: string | null;
    name: string | null;
    notes: string | null;
    phone: string | null;
    provider_name: string | null;
    reference: string | null;
    reference_origin: string | null;
    state_code: string | null;
    static_map_url: string | null;
    zip_code: string | null;
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
    billingAddress: CustomerAddress;
    shippingAddress: CustomerAddress;
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
    shouldFetchRewards: boolean;
}

export interface AlertsState {
    alerts: CustomAlert[];
}

export interface CustomAlert {
    id: string;
    level: AlertLevel;
    message: string;
    timestamp: DateTime;
}
