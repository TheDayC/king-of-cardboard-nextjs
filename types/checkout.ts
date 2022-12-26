export interface FormErrors {
    [x: string]: any; // eslint-disable-line @typescript-eslint/no-explicit-any
}

export interface PaymentAttributes {
    [x: string]: string;
}

export interface ShippingMethods {
    id: string;
    name: string;
    price_amount_cents: number;
    price_amount_float: number;
    price_amount_for_shipment_cents: number;
    price_amount_for_shipment_float: number;
    currency_code: string;
    formatted_price_amount: string;
    formatted_price_amount_for_shipment: string;
}

export interface Method {
    id: string;
    name: string;
    price: string;
    minDays: number;
    maxDays: number;
}

export interface Shipment {
    id: string;
    category: string;
    methods: Method[];
}

export interface CustomerDetails {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
}

export interface Address {
    lineOne: string;
    lineTwo: string;
    company: string;
    city: string;
    postcode: string;
    county: string;
    country: string;
}
