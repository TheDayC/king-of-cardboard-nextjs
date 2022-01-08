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
        customerDetails,
        checkoutLoading: global.checkoutLoading,
        orderId: cart.orderId,
        subTotal: cart.subTotal,
        shipping: cart.shipping,
        total: cart.total,
        items: cart.items,
        orderNumber: cart.orderNumber,
        billingAddress: checkout.billingAddress,
        shippingAddress: checkout.shippingAddress,
        balance: account.giftCard.balance,
    })
);

export default selector;
