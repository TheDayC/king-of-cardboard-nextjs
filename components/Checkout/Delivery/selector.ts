import { createSelector } from '@reduxjs/toolkit';

import { selectCheckoutData, selectGlobalData, selectCartData } from '../../../store/state/selectors';

const selector = createSelector([selectCheckoutData, selectGlobalData, selectCartData], (checkout, global, cart) => ({
    customerDetails: checkout.customerDetails,
    accessToken: global.accessToken,
    currentStep: checkout.currentStep,
    orderId: cart.orderId,
    checkoutLoading: global.checkoutLoading,
    hasBothAddresses: Boolean(checkout.billingAddress.line_1) && Boolean(checkout.shippingAddress.line_1),
    shipments: checkout.shipments,
}));

export default selector;
