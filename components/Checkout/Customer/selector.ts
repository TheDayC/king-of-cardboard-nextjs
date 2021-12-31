import { createSelector } from '@reduxjs/toolkit';

import { selectCartData, selectCheckoutData, selectGlobalData } from '../../../store/state/selectors';

const selector = createSelector([selectCheckoutData, selectCartData, selectGlobalData], (checkout, cart, global) => ({
    currentStep: checkout.currentStep,
    customerDetails: checkout.customerDetails,
    order: cart.order,
    accessToken: global.accessToken,
    checkoutLoading: global.checkoutLoading,
    isShippingSameAsBilling: checkout.isShippingSameAsBilling,
    cloneBillingAddressId: checkout.cloneBillingAddressId,
    cloneShippingAddressId: checkout.cloneShippingAddressId,
}));

export default selector;
