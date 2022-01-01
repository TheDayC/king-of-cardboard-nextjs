import { createSelector } from '@reduxjs/toolkit';

import { selectGlobalData, selectCartData, selectCheckoutData } from '../../../store/state/selectors';

const selector = createSelector([selectGlobalData, selectCartData, selectCheckoutData], (global, cart, checkout) => ({
    accessToken: global.accessToken,
    checkoutLoading: global.checkoutLoading,
    order: cart.order,
    items: cart.items,
    customerDetails: checkout.customerDetails,
    billingAddress: checkout.billingAddress,
    shippingAddress: checkout.shippingAddress,
}));

export default selector;
