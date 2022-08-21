import { CartState } from '../types/state';

const cartInitialState: CartState = {
    shouldCreateOrder: true,
    shouldUpdateCart: false,
    orderId: null,
    orderNumber: null,
    orderExpiry: null,
    itemCount: 0,
    items: [],
    isUpdatingCart: false,
    subTotal: '£0.00',
    shipping: '£0.00',
    discount: '£0.00',
    total: '£0.00',
    orderHasGiftCard: false,
    updateQuantities: [],
};

export default cartInitialState;
