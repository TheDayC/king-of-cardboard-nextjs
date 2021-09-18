import { createSelector } from '@reduxjs/toolkit';

import { selectCheckoutData } from '../../../store/state/selectors';

const selector = createSelector([selectCheckoutData], (checkout) => ({
    currentStep: checkout.currentStep,
    customerDetails: checkout.customerDetails,
}));

export default selector;
