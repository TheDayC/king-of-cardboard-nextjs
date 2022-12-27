import { createSelector } from '@reduxjs/toolkit';

import { selectCheckoutData, selectGlobalData } from '../../../store/state/selectors';

const selector = createSelector([selectCheckoutData, selectGlobalData], (checkout, global) => ({
    customerDetails: checkout.customerDetails,
    currentStep: checkout.currentStep,
    isCheckoutLoading: checkout.isCheckoutLoading,
    hasBothAddresses: Boolean(checkout.billingAddress.lineOne) && Boolean(checkout.shippingAddress.lineOne),
    shippingMethods: checkout.shippingMethods,
}));

export default selector;
