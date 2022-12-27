import { DateTime } from 'luxon';
import { Category, Configuration, Interest, StockStatus } from '../../enums/products';

import { AlertLevel } from '../../enums/system';
import { AccountAddress, Order, SingleAddress, SingleOrder } from '../../types/account';
import { Break, SingleBreak } from '../../types/breaks';
import { CartItem } from '../../types/cart';
import { Address, CustomerDetails, Shipment } from '../../types/checkout';
import { ContentfulPage } from '../../types/pages';
import { SingleProduct } from '../../types/products';
import { Product } from '../../types/productsNew';
import { SocialMedia } from '../../types/profile';
import { AccountShippingMethod } from '../../types/shipping';

export interface AppStateShape {
    global: Global;
    products: ProductsState;
    cart: CartState;
    alerts: AlertsState;
    filters: Filters;
    checkout: Checkout;
    confirmation: Confirmation;
    pages: PagesState;
    breaks: BreaksState;
    account: AccountState;
}

export interface CartState {
    items: CartItem[];
    isUpdatingCart: boolean;
    subTotal: number;
    shipping: number;
    discount: number;
    total: number;
    shouldUseCoins: boolean;
}

export interface PaymentMethod {
    id: string;
    name: string;
    payment_source_type: string;
}

export interface Filters {
    categories: Category[];
    interests: Interest[];
    configurations: Configuration[];
    stockStatus: StockStatus[];
}

export interface Global {
    checkoutLoading: boolean;
    accessToken: string | null;
    userToken: string | null;
    userTokenExpiry: string | null;
    isFetchingToken: boolean;
    userId: string | null;
    expires: string | null;
    hasRejected: boolean;
    sessionEmail: string | null;
    isDrawerOpen: boolean;
}

export interface Checkout {
    currentStep: number;
    customerDetails: CustomerDetails;
    billingAddress: Address;
    shippingAddress: Address;
    existingBillingAddressId: string | null;
    existingShippingAddressId: string | null;
    isShippingSameAsBilling: boolean;
    paymentMethods: PaymentMethod[];
    shippingMethods: AccountShippingMethod[];
    isCheckoutLoading: boolean;
    chosenShippingMethodId: string | null;
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
    billingAddress: Address;
    shippingAddress: Address;
}

export interface PagesState {
    isLoadingPages: boolean;
    shouldLoadPages: boolean;
    pages: ContentfulPage[];
}

export interface BreaksState {
    currentPage: number;
    breaksTotal: number;
    isLoadingBreaks: boolean;
    isLoadingBreak: boolean;
    breaks: Break[];
    currentBreak: SingleBreak;
    order: string;
}

export interface AccountState {
    socialMedia: SocialMedia;
    balance: number;
    shouldFetchRewards: boolean;
    coins: number;
    orders: Order[];
    orderPageCount: number;
    currentOrder: SingleOrder;
    addresses: AccountAddress[];
    addressCount: number;
    isLoadingAddressBook: boolean;
    currentAddress: SingleAddress;
    isLoadingOrder: boolean;
    isLoadingOrders: boolean;
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
    isImport?: boolean;
}

export interface ProductsState {
    products: Product[];
    productsTotal: number;
    isLoadingProducts: boolean;
    currentProduct: SingleProduct;
}
