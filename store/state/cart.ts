import { CartState } from '../types/state';

const cartInitialState: CartState = {
    shouldCreateOrder: true,
    shouldUpdateCart: false,
    orderId: null,
    orderNumber: null,
    orderExpiry: null,
    items: [],
    isUpdatingCart: false,
    subTotal: 0,
    shipping: 0,
    discount: 0,
    total: 0,
    orderHasGiftCard: false,
    updateQuantities: [],
};

export default cartInitialState;
