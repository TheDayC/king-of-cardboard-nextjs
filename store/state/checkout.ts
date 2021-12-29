import { Checkout } from '../types/state';

const checkoutInitialState: Checkout = {
    currentStep: 0,
    shipmentsWithMethods: null,
    customerDetails: {
        email: null,
        firstName: null,
        lastName: null,
        company: null,
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
    cloneAddressId: null,
    isShippingSameAsBilling: false,
};

export default checkoutInitialState;
