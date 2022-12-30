import { Supplier } from '../enums/shipping';

export interface FormErrors {
    [x: string]: any; // eslint-disable-line @typescript-eslint/no-explicit-any
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

export interface AddOrderResponse {
    _id: string | null;
    orderNumber: number | null;
    subTotal: number;
    shipping: number;
    discount: number;
    total: number;
}
