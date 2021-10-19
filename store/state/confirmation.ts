import { Confirmation } from '../types/state';

const confirmationInitialState: Confirmation = {
    order: null,
    items: [],
    customerDetails: {
        allowShippingAddress: false,
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
};

export default confirmationInitialState;
