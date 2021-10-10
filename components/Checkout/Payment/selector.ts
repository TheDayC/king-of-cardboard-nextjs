import { createSelector } from '@reduxjs/toolkit';

import { selectCartData, selectCheckoutData } from '../../../store/state/selectors';

const selector = createSelector([selectCheckoutData, selectCartData], (checkout, cart) => ({
    currentStep: checkout.currentStep,
    paymentMethods: cart.paymentMethods,
}));

export default selector;
