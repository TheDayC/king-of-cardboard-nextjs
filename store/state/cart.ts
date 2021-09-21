import { CartState } from '../types/state';

const cartInitialState: CartState = {
    order: null,
    items: [],
    shouldFetchOrder: true,
};

export default cartInitialState;
