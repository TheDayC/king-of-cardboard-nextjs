import { createSelector } from '@reduxjs/toolkit';

import { selectCheckoutData, selectAccountData } from '../../../store/state/selectors';

const selector = createSelector([selectCheckoutData, selectAccountData], (checkout, account) => ({
    currentStep: checkout.currentStep,
    customerDetails: checkout.customerDetails,
    isCheckoutLoading: checkout.isCheckoutLoading,
    isShippingSameAsBilling: checkout.isShippingSameAsBilling,
    billingAddress: checkout.billingAddress,
    shippingAddress: checkout.shippingAddress,
}));

export default selector;
