export interface StripeLineItems {
    price: string;
    quantity: number;
}

export interface CommerceLayerResponse {
    id: string;
    type: string;
    links: CommerceLayerObject;
    meta: CommerceLayerObject;
    attributes: CommerceLayerObject;
    relationships: any; // eslint-disable-line @typescript-eslint/no-explicit-any
}

export interface CommerceLayerObject {
    [key: string]: string;
}

export interface CommerceLayerMeta {
    record_count: number;
    page_count: number;
}

export interface CommerceLayerLineItemRelationship {
    id: string;
    type: string;
}

export interface PaymentSourceResponse {
    paymentId: string | null;
    clientSecret: string | null;
}
