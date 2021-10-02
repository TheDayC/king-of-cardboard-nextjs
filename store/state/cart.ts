import { CartState } from '../types/state';

const cartInitialState: CartState = {
    order: null,
    items: [],
    paymentMethods: [],
    shouldFetchOrder: true,
};

export default cartInitialState;
