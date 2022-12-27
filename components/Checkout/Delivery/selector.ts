import { createSelector } from '@reduxjs/toolkit';

import { selectCheckoutData, selectGlobalData } from '../../../store/state/selectors';

const selector = createSelector([selectCheckoutData, selectGlobalData], (checkout, global) => ({
    customerDetails: checkout.customerDetails,
    currentStep: checkout.currentStep,
    checkoutLoading: global.checkoutLoading,
    hasBothAddresses: Boolean(checkout.billingAddress.lineOne) && Boolean(checkout.shippingAddress.lineTwo),
    shipments: checkout.shippingMethods,
}));

export default selector;
