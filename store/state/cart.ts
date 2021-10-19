import { CartState } from '../types/state';

const cartInitialState: CartState = {
    order: null,
    items: [],
    paymentMethods: [],
    shouldFetchOrder: true,
    isUpdatingCart: false,
};

export default cartInitialState;
