import { Checkout } from '../types/state';

const checkoutInitialState: Checkout = {
    currentStep: 0,
    subTotal: 0,
    taxes: 0,
    total: 0,
    taxRate: 0.2,
    customerDetails: {
        email: null,
        firstName: null,
        lastName: null,
        addressLineOne: null,
        addressLineTwo: null,
        city: null,
        postcode: null,
        county: null,
        phone: null,
        shippingAddressLineOne: null,
        shippingAddressLineTwo: null,
        shippingCity: null,
        shippingPostcode: null,
        shippingCounty: null,
    },
};

export default checkoutInitialState;
