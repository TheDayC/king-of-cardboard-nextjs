import { createSelector } from '@reduxjs/toolkit';

import { selectCartData, selectCheckoutData, selectAccountData } from '../../../store/state/selectors';

const selector = createSelector([selectCheckoutData, selectCartData, selectAccountData], (checkout, cart, account) => ({
    currentStep: checkout.currentStep,
    customerDetails: checkout.customerDetails,
    isCheckoutLoading: checkout.isCheckoutLoading,
    subTotal: cart.subTotal,
    shipping: cart.shipping,
    discount: cart.discount,
    total: cart.total,
    items: cart.items,
    billingAddress: checkout.billingAddress,
    shippingAddress: checkout.shippingAddress,
    coins: account.coins,
    shouldEnable:
        checkout.billingAddress.lineOne.length &&
        checkout.shippingAddress.lineOne.length &&
        checkout.chosenShippingMethodId,
}));

export default selector;
