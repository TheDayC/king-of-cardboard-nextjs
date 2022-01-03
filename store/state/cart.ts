import { CartState } from '../types/state';

const cartInitialState: CartState = {
    shouldCreateOrder: true,
    shouldUpdateCart: false,
    orderId: null,
    orderNumber: null,
    itemCount: 0,
    items: [],
    isUpdatingCart: false,
    subTotal: null,
    shipping: null,
    total: null,
};

export default cartInitialState;
