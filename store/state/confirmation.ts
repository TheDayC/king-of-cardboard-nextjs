import { Confirmation } from '../types/state';

const defaultAddress = {
    lineOne: '',
    lineTwo: '',
    company: '',
    city: '',
    postcode: '',
    county: '',
    country: '',
};

const confirmationInitialState: Confirmation = {
    items: [],
    subTotal: '£0.00',
    shipping: '£0.00',
    discount: '£0.00',
    total: '£0.00',
    orderNumber: null,
    customerDetails: {
        email: '',
        firstName: '',
        lastName: '',
        phone: '',
    },
    billingAddress: defaultAddress,
    shippingAddress: defaultAddress,
};

export default confirmationInitialState;
