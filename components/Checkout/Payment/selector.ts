import { createSelector } from '@reduxjs/toolkit';

import {
    selectCartData,
    selectCheckoutData,
    selectCheckoutCustomerData,
    selectAccountData,
} from '../../../store/state/selectors';

const selector = createSelector(
    [selectCheckoutData, selectCartData, selectCheckoutCustomerData, selectAccountData],
    (checkout, cart, customerDetails, account) => ({
        currentStep: checkout.currentStep,
        customerDetails,
        isCheckoutLoading: checkout.isCheckoutLoading,
        subTotal: cart.subTotal,
        shipping: cart.shipping,
        total: cart.total,
        items: cart.items,
        billingAddress: checkout.billingAddress,
        shippingAddress: checkout.shippingAddress,
        coins: account.coins,
        shouldEnable:
            checkout.billingAddress.lineOne.length &&
            checkout.shippingAddress.lineOne.length &&
            checkout.chosenShippingMethodId,
    })
);

export default selector;
