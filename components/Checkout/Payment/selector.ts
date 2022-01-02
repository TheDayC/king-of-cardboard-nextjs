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
        customerDetails,
        checkoutLoading: global.checkoutLoading,
        orderId: cart.orderId,
        items: cart.items,
        confirmationDetails: confirmation,
        billingAddress: checkout.billingAddress,
        shippingAddress: checkout.shippingAddress,
        hasBothAddresses: Boolean(checkout.billingAddress.line_1) && Boolean(checkout.shippingAddress.line_1),
        hasShipmentMethods: Boolean(checkout.shipmentsWithMethods),
    })
);

export default selector;
