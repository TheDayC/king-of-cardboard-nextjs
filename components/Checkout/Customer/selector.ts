import { createSelector } from '@reduxjs/toolkit';

import { selectCheckoutData, selectGlobalData } from '../../../store/state/selectors';

const selector = createSelector([selectCheckoutData, selectGlobalData], (checkout, global) => ({
    currentStep: checkout.currentStep,
    customerDetails: checkout.customerDetails,
    isCheckoutLoading: checkout.isCheckoutLoading,
    isShippingSameAsBilling: checkout.isShippingSameAsBilling,
    billingAddress: checkout.billingAddress,
    shippingAddress: checkout.shippingAddress,
}));

export default selector;
