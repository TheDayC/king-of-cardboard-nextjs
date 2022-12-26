import { Checkout } from '../types/state';

const defaultAddress = {
    lineOne: '',
    lineTwo: '',
    company: '',
    city: '',
    postcode: '',
    county: '',
    country: '',
};

const checkoutInitialState: Checkout = {
    currentStep: 0,
    customerDetails: {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
    },
    billingAddress: defaultAddress,
    shippingAddress: defaultAddress,
    cloneBillingAddressId: null,
    cloneShippingAddressId: null,
    isShippingSameAsBilling: false,
    paymentMethods: [],
    shipments: [],
};

export default checkoutInitialState;
