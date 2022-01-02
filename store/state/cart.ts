import { CartState } from '../types/state';

const cartInitialState: CartState = {
    order: null,
    orderId: null,
    itemCount: 0,
    items: [],
    paymentMethods: [],
    shouldFetchOrder: true,
    isUpdatingCart: false,
};

export default cartInitialState;
