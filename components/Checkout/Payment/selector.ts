import { createSelector } from '@reduxjs/toolkit';

import {
    selectCartData,
    selectCheckoutData,
    selectGlobalData,
    selectCheckoutCustomerData,
    selectConfirmationData,
} from '../../../store/state/selectors';

const selector = createSelector(
    [selectCheckoutData, selectCartData, selectGlobalData, selectCheckoutCustomerData, selectConfirmationData],
    (checkout, cart, global, customerDetails, confirmation) => ({
        currentStep: checkout.currentStep,
        paymentMethods: cart.paymentMethods,
        accessToken: global.accessToken,
        orderId: cart.order ? cart.order.id : null,
        customerDetails,
        checkoutLoading: global.checkoutLoading,
        order: cart.order,
        items: cart.items,
        confirmationDetails: confirmation,
        billingAddress: checkout.billingAddress,
        shippingAddress: checkout.shippingAddress,
    })
);

export default selector;
