import { createSelector } from '@reduxjs/toolkit';

import {
    selectCartData,
    selectCheckoutData,
    selectGlobalData,
    selectAccountData,
} from '../../../store/state/selectors';

const selector = createSelector(
    [selectCheckoutData, selectCartData, selectGlobalData, selectAccountData],
    (checkout, cart, global, account) => ({
        currentStep: checkout.currentStep,
        customerDetails: checkout.customerDetails,
        checkoutLoading: global.checkoutLoading,
        isShippingSameAsBilling: checkout.isShippingSameAsBilling,
        cloneBillingAddressId: checkout.cloneBillingAddressId,
        cloneShippingAddressId: checkout.cloneShippingAddressId,
        billingAddress: checkout.billingAddress,
        shippingAddress: checkout.shippingAddress,
        addresses: account.addresses,
    })
);

export default selector;
