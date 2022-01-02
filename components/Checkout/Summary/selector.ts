import { createSelector } from '@reduxjs/toolkit';

import { selectCartData, selectGlobalData, selectConfirmationData } from '../../../store/state/selectors';

const selector = createSelector(
    [selectCartData, selectGlobalData, selectConfirmationData],
    (cart, global, confirmation) => ({
        orderNumber: cart.orderNumber,
        confirmationOrderNumber: confirmation.orderNumber,
        checkoutLoading: global.checkoutLoading,
        cartItems: cart.items,
        confirmedItems: confirmation.items,
    })
);

export default selector;
