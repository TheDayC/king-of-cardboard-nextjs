import { createSelector } from '@reduxjs/toolkit';

import { selectCartData, selectCheckoutData } from '../../../store/state/selectors';

const selector = createSelector([selectCheckoutData, selectCartData], (checkout, cart) => ({
    currentStep: checkout.currentStep,
    customerDetails: checkout.customerDetails,
    order: cart.order,
}));

export default selector;
