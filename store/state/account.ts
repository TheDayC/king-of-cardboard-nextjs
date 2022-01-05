import { AccountState } from '../types/state';

const accountInitialState: AccountState = {
    socialMedia: {
        instagram: '',
        twitter: '',
        twitch: '',
        youtube: '',
        ebay: '',
    },
    balance: 0,
    shouldFetchRewards: true,
    giftCard: {
        id: '',
        status: '',
        balance: 0,
        reference: '',
        recipient_email: '',
        code: '',
    },
    orders: [],
    orderPageCount: 0,
    currentOrder: {
        status: '',
        payment_status: '',
        fulfillment_status: '',
        skus_count: 0,
        shipments_count: 0,
        formatted_subtotal_amount: '',
        formatted_shipping_amount: '',
        formatted_discount_amount: '',
        formatted_total_amount: '',
        placed_at: '',
        updated_at: '',
        payment_method_details: {
            brand: '',
            checks: {
                address_line1_check: '',
                address_postal_code_check: '',
                cvc_check: '',
            },
            country: '',
            exp_month: 0,
            exp_year: 0,
            fingerprint: '',
            funding: '',
            generated_from: '',
            last4: '',
        },
        shipping_address: {
            first_name: '',
            last_name: '',
            company: '',
            line_1: '',
            line_2: '',
            city: '',
            zip_code: '',
            state_code: '',
            country_code: '',
            phone: '',
        },
        billing_address: {
            first_name: '',
            last_name: '',
            company: '',
            line_1: '',
            line_2: '',
            city: '',
            zip_code: '',
            state_code: '',
            country_code: '',
            phone: '',
        },
        lineItems: [],
    },
    addresses: [],
    addressPageCount: 0,
};

export default accountInitialState;
