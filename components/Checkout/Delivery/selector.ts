import { createSelector } from '@reduxjs/toolkit';

import { selectCheckoutData, selectGlobalData, selectCartData } from '../../../store/state/selectors';

const selector = createSelector([selectCheckoutData, selectGlobalData, selectCartData], (checkout, global, cart) => ({
    customerDetails: checkout.customerDetails,
    accessToken: global.accessToken,
    currentStep: checkout.currentStep,
    shippingMethod: checkout.shippingMethod,
    order: cart.order,
}));

export default selector;
