import { CommerceLayerMeta, CommerceLayerResponse } from './api';

export interface GetOrders {
    orders: CommerceLayerResponse[] | null;
    included: CommerceLayerResponse[] | null;
    meta: CommerceLayerMeta | null;
}

export interface OrderHistoryLineItem {
    id: string;
    type: string;
    sku_code: string | null;
    image_url: string | null;
    quantity: number;
}

export interface OrderHistoryLineItemWithSkuData {
    lineItemId: string;
    skuId: string;
    name: string | null;
    skuCode: string | null;
    imageUrl: string | null;
    quantity: number;
    amount: string | null;
    compareAmount: string | null;
}

export interface OrderHistoryAddress {
    first_name: string | null;
    last_name: string | null;
    company: string | null;
    line_1: string | null;
    line_2: string | null;
    city: string | null;
    zip_code: string | null;
    state_code: string | null;
    country_code: string | null;
    phone: string | null;
}

export interface OrderHistoryPaymentMethod {
    brand: string;
    checks: {
        address_line1_check: string;
        address_postal_code_check: string;
        cvc_check: string;
    };
    country: string | null;
    exp_month: number | null;
    exp_year: number | null;
    fingerprint: string | null;
    funding: string | null;
    generated_from: string | null;
    last4: string | null;
}

export interface GiftCard {
    id: string;
    status: string;
    balance: number;
    reference: string;
    recipient_email: string;
    code: string;
}
