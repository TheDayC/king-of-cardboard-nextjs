import { createSelector } from '@reduxjs/toolkit';

import { selectGlobalData, selectCartData, selectCheckoutData } from '../../../store/state/selectors';

const selector = createSelector([selectGlobalData, selectCartData, selectCheckoutData], (global, cart, checkout) => ({
    checkoutLoading: global.checkoutLoading,
    items: cart.items,
    subTotal: cart.subTotal,
    shipping: cart.shipping,
    total: cart.total,
    customerDetails: checkout.customerDetails,
    billingAddress: checkout.billingAddress,
    shippingAddress: checkout.shippingAddress,
}));

export default selector;
