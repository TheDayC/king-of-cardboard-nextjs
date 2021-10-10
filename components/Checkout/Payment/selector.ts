import { createSelector } from '@reduxjs/toolkit';

import { selectCartData, selectCheckoutData, selectGlobalData } from '../../../store/state/selectors';

const selector = createSelector([selectCheckoutData, selectCartData, selectGlobalData], (checkout, cart, global) => ({
    currentStep: checkout.currentStep,
    paymentMethods: cart.paymentMethods,
    accessToken: global.accessToken,
    orderId: cart.order ? cart.order.id : null,
}));

export default selector;
