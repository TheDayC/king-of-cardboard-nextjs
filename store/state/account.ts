import { PaymentMethods } from '../../enums/checkout';
import { Fulfillment, Payment, Status } from '../../enums/orders';
import { AccountState } from '../types/state';

const defaultAddress = {
    lineOne: '',
    lineTwo: '',
    company: '',
    city: '',
    postcode: '',
    county: '',
    country: '',
};

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
    coins: 0,
    orders: [],
    orderCount: 0,
    currentOrder: {
        _id: '',
        userId: '',
        email: '',
        orderStatus: Status.Pending,
        paymentStatus: Payment.Unpaid,
        fulfillmentStatus: Fulfillment.Unfulfilled,
        items: [],
        created: '',
        lastUpdated: '',
        subTotal: 0,
        discount: 0,
        shipping: 0,
        total: 0,
        customerDetails: {
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
        },
        shippingAddress: defaultAddress,
        billingAddress: defaultAddress,
        paymentId: '',
        paymentMethod: PaymentMethods.Unknown,
        shippingMethodId: '',
        orderNumber: 0,
        trackingNumber: null,
    },
    addresses: [],
    addressCount: 0,
    isLoadingAddressBook: false,
    isLoadingOrder: false,
    isLoadingOrders: false,
};

export default accountInitialState;
