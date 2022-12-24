import { createSelector } from '@reduxjs/toolkit';

import {
    selectCartData,
    selectCheckoutData,
    selectGlobalData,
    selectCheckoutCustomerData,
    selectAccountData,
} from '../../../store/state/selectors';

const selector = createSelector(
    [selectCheckoutData, selectCartData, selectGlobalData, selectCheckoutCustomerData, selectAccountData],
    (checkout, cart, global, customerDetails, account) => ({
        currentStep: checkout.currentStep,
        paymentMethods: checkout.paymentMethods,
        accessToken: global.accessToken,
        userToken: global.userToken,
        customerDetails,
        checkoutLoading: global.checkoutLoading,
        subTotal: cart.subTotal,
        shipping: cart.shipping,
        total: cart.total,
        items: cart.items,
        billingAddress: checkout.billingAddress,
        shippingAddress: checkout.shippingAddress,
        coins: account.coins,
    })
);

export default selector;
