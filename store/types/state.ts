import { DateTime } from 'luxon';

import { Categories, ProductType } from '../../enums/shop';
import { AlertLevel } from '../../enums/system';
import { Address, GiftCard, Order, SingleAddress, SingleOrder } from '../../types/account';
import { Break, SingleBreak } from '../../types/breaks';
import { CartItem } from '../../types/cart';
import { MergedShipmentMethods } from '../../types/checkout';
import { ContentfulPage } from '../../types/pages';
import { Product, SingleProduct } from '../../types/products';
import { SocialMedia } from '../../types/profile';

export interface IAppState {
    global: Global;
    products: ProductsState;
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
    shouldCreateOrder: boolean;
    shouldUpdateCart: boolean;
    orderId: string | null;
    orderNumber: number | null;
    itemCount: number;
    items: CartItem[];
    isUpdatingCart: boolean;
    subTotal: string;
    shipping: string;
    discount: string;
    total: string;
    orderHasGiftCard: boolean;
}

export interface PaymentMethod {
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
    paymentMethods: PaymentMethod[];
    shipments: string[];
    shippingMethods: MergedShipmentMethods[];
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

export interface ExistingAddress {
    title: string | null;
    billing_info: string | null;
    business: boolean;
    city: string | null;
    company: string | null;
    country_code: string | null;
    email: string | null;
    first_name: string | null;
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
    items: CartItem[];
    subTotal: string;
    shipping: string;
    discount: string;
    total: string;
    orderNumber: number | null;
    customerDetails: CustomerDetails;
    billingAddress: CustomerAddress;
    shippingAddress: CustomerAddress;
}

export interface PagesState {
    isLoadingPages: boolean;
    shouldLoadPages: boolean;
    pages: ContentfulPage[];
}

export interface ShopState {
    currentPage: number;
    isLoadingProducts: boolean;
}

export interface BreaksState {
    currentPage: number;
    breaksTotal: number;
    isLoadingBreaks: boolean;
    breaks: Break[];
    currentBreak: SingleBreak;
}

export interface AccountState {
    socialMedia: SocialMedia;
    balance: number;
    shouldFetchRewards: boolean;
    giftCard: GiftCard;
    orders: Order[];
    orderPageCount: number;
    currentOrder: SingleOrder;
    addresses: Address[];
    addressPageCount: number;
    currentAddress: SingleAddress;
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

export interface CommonThunkInput {
    accessToken: string;
    orderId: string;
}

export interface ProductsState {
    products: Product[];
    productsTotal: number;
    currentProduct: SingleProduct;
}
