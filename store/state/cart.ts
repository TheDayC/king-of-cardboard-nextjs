import { CartState } from '../types/state';

const cartInitialState: CartState = {
    order: null,
    orderId: null,
    orderNumber: null,
    itemCount: 0,
    items: [],
    paymentMethods: [],
    shouldFetchOrder: true,
    isUpdatingCart: false,
    subTotal: null,
    shipping: null,
    total: null,
};

export default cartInitialState;
