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
        orderId: cart.order ? cart.order.id : null,
        customerDetails,
    })
);

export default selector;
