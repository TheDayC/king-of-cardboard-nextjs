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
