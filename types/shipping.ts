import { Supplier } from '../enums/shipping';

export interface ShippingMethod {
    title: string;
    slug: string;
    content: string;
    price: number;
    min: number;
    max: number;
    supplier: Supplier;
}

export interface AccountShippingMethod extends ShippingMethod {
    _id: string;
    created: string;
    lastUpdated: string;
}

export interface ListShippingMethods {
    shippingMethods: AccountShippingMethod[];
    count: number;
}
