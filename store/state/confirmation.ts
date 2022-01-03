import { Confirmation } from '../types/state';

const defaultAddress = {
    id: null,
    billing_info: null,
    business: false,
    city: null,
    company: null,
    country_code: null,
    email: null,
    first_name: null,
    full_address: null,
    full_name: null,
    is_geocoded: false,
    is_localized: false,
    last_name: null,
    lat: null,
    line_1: null,
    line_2: null,
    lng: null,
    map_url: null,
    name: null,
    notes: null,
    phone: null,
    provider_name: null,
    reference: null,
    reference_origin: null,
    state_code: null,
    static_map_url: null,
    zip_code: null,
};

const confirmationInitialState: Confirmation = {
    items: [],
    subTotal: '£0.00',
    shipping: '£0.00',
    discount: '£0.00',
    total: '£0.00',
    orderNumber: null,
    customerDetails: {
        email: null,
        first_name: null,
        last_name: null,
        phone: null,
    },
    billingAddress: defaultAddress,
    shippingAddress: defaultAddress,
};

export default confirmationInitialState;
