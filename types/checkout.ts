export interface PersonalDetails {
    allowShippingAddress: boolean;
    billingAddressLineOne: string;
    billingAddressLineTwo: string;
    billingCity: string;
    billingCounty: string;
    billingPostcode: string;
    email: string;
    firstName: string;
    lastName: string;
    phone: string;
    shippingAddressLineOne?: string;
    shippingAddressLineTwo?: string;
    shippingCity?: string;
    shippingCounty?: string;
    shippingPostcode?: string;
}
