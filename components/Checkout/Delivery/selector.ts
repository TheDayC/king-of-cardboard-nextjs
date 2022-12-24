import { createSelector } from '@reduxjs/toolkit';

import { selectCheckoutData, selectGlobalData } from '../../../store/state/selectors';

const selector = createSelector([selectCheckoutData, selectGlobalData], (checkout, global) => ({
    customerDetails: checkout.customerDetails,
    currentStep: checkout.currentStep,
    checkoutLoading: global.checkoutLoading,
    hasBothAddresses: Boolean(checkout.billingAddress.line_1) && Boolean(checkout.shippingAddress.line_1),
    shipments: checkout.shipments,
}));

export default selector;
