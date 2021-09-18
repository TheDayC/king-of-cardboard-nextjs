import { createSelector } from '@reduxjs/toolkit';

import { selectCheckoutData, selectGlobalData } from '../../../store/state/selectors';

const selector = createSelector([selectCheckoutData, selectGlobalData], (checkout, global) => ({
    customerDetails: checkout.customerDetails,
    accessToken: global.accessToken,
    currentStep: checkout.currentStep,
    shippingMethod: checkout.shippingMethod,
}));

export default selector;
