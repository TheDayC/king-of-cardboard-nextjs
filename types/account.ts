import { CommerceLayerMeta, CommerceLayerResponse } from './api';

export interface Order {
    number: number;
    status: string;
    payment_status: string;
    fulfillment_status: string;
    skus_count: number;
    shipments_count: number;
    formatted_total_amount_with_taxes: string;
    placed_at: string;
    updated_at: string;
    lineItems: OrderLineItem[];
}

export interface SingleOrder {
    status: string;
    payment_status: string;
    fulfillment_status: string;
    skus_count: number;
    shipments_count: number;
    formatted_subtotal_amount: string;
    formatted_shipping_amount: string;
    formatted_discount_amount: string;
    formatted_total_amount: string;
    placed_at: string;
    updated_at: string;
    payment_method_details: OrderHistoryPaymentMethod;
    shipping_address: OrderHistoryAddress;
    billing_address: OrderHistoryAddress;
    lineItems: OrderHistoryLineItemWithSkuData[];
}

export interface GetOrders {
    orders: CommerceLayerResponse[] | null;
    included: CommerceLayerResponse[] | null;
    meta: CommerceLayerMeta | null;
}

export interface OrderLineItem {
    id: string;
    type: string;
    sku_code: string | null;
    image_url: string | null;
    quantity: number;
}

export interface OrderHistoryLineItemWithSkuData {
    lineItemId: string;
    skuId: string;
    name: string;
    skuCode: string;
    imageUrl: string;
    quantity: number;
    amount: string;
    compareAmount: string;
}

export interface OrderHistoryAddress {
    first_name: string;
    last_name: string;
    company: string;
    line_1: string;
    line_2: string;
    city: string;
    zip_code: string;
    state_code: string;
    country_code: string;
    phone: string;
}

export interface OrderHistoryPaymentMethod {
    brand: string;
    checks: {
        address_line1_check: string;
        address_postal_code_check: string;
        cvc_check: string;
    };
    country: string;
    exp_month: number;
    exp_year: number;
    fingerprint: string;
    funding: string;
    generated_from: string;
    last4: string;
}

export interface GiftCard {
    id: string;
    status: string;
    balance: number;
    reference: string;
    recipient_email: string;
    code: string;
}

export interface Address {
    id: string;
    name: string;
    full_address: string;
}

export interface SingleAddress {
    id: string;
    addressId: string;
    name: string;
    addressLineOne: string;
    addressLineTwo: string;
    city: string;
    company: string;
    county: string;
    firstName: string;
    lastName: string;
    phone: string;
    postcode: string;
}
