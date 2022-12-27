import { createSelector } from '@reduxjs/toolkit';

import { selectCartData, selectConfirmationData, selectCheckoutData } from '../../../store/state/selectors';

const selector = createSelector(
    [selectCartData, selectCheckoutData, selectConfirmationData],
    (cart, checkout, confirmation) => ({
        confirmationOrderNumber: confirmation.orderNumber,
        isCheckoutLoading: checkout.isCheckoutLoading,
        cartItems: cart.items,
        confirmedItems: confirmation.items,
    })
);

export default selector;
