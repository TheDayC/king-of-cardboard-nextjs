import { CartState } from '../types/state';

const cartInitialState: CartState = {
    items: [],
    isUpdatingCart: false,
    subTotal: 0,
    shipping: 0,
    discount: 0,
    total: 0,
    shouldUseCoins: false,
};

export default cartInitialState;
