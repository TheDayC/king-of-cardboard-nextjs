import { createSelector } from '@reduxjs/toolkit';

import { selectCheckoutData, selectGlobalData } from '../../store/state/selectors';

const selector = createSelector([selectCheckoutData, selectGlobalData], (checkout, global) => ({
    currentStep: checkout.currentStep,
    accessToken: global.accessToken,
}));

export default selector;
