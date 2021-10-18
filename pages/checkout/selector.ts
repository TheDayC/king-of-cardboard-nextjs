import { createSelector } from '@reduxjs/toolkit';

import { selectCheckoutData } from '../../store/state/selectors';

const selector = createSelector([selectCheckoutData], (checkout) => ({
    currentStep: checkout.currentStep,
    hasCompletedOrder: checkout.hasCompletedOrder,
}));

export default selector;
