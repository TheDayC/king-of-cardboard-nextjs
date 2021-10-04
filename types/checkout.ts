export interface PersonalDetails extends BillingAddress, ShippingAddress {
    allowShippingAddress: boolean;
    email: string;
    firstName: string;
    lastName: string;
    phone: string;
}

export interface BillingAddress {
    billingAddressLineOne: string;
    billingAddressLineTwo: string;
    billingCity: string;
    billingCounty: string;
    billingPostcode: string;
}

export interface ShippingAddress {
    shippingAddressLineOne?: string;
    shippingAddressLineTwo?: string;
    shippingCity?: string;
    shippingCounty?: string;
    shippingPostcode?: string;
}

export interface DeliveryDetails {
    shippingMethod: string;
}

export interface ShippingMethods {
    id: string | null;
    name: string | null;
    price_amount_cents: number;
    price_amount_float: number;
    price_amount_for_shipment_cents: number;
    price_amount_for_shipment_float: number;
    currency_code: string | null;
    formatted_price_amount: string | null;
    formatted_price_amount_for_shipment: string | null;
}

export interface DeliveryLeadTimes {
    id: string;
    minHours: number;
    maxHours: number;
    minDays: number;
    maxDays: number;
}
