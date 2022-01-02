import { createSelector } from '@reduxjs/toolkit';

import {
    selectCartData,
    selectCheckoutData,
    selectGlobalData,
    selectCheckoutCustomerData,
} from '../../../store/state/selectors';

const selector = createSelector(
    [selectCheckoutData, selectCartData, selectGlobalData, selectCheckoutCustomerData],
    (checkout, cart, global, customerDetails) => ({
        currentStep: checkout.currentStep,
        paymentMethods: cart.paymentMethods,
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
        hasBothAddresses: Boolean(checkout.billingAddress.line_1) && Boolean(checkout.shippingAddress.line_1),
        hasShipmentMethods: Boolean(checkout.shipmentsWithMethods),
    })
);

export default selector;
