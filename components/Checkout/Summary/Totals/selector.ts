import { createSelector } from '@reduxjs/toolkit';

import { selectCartData, selectConfirmationData } from '../../../../store/state/selectors';

const selector = createSelector([selectCartData, selectConfirmationData], (cart, confirmation) => ({
    cartSubTotal: cart.subTotal,
    cartShipping: cart.shipping,
    cartDiscount: cart.discount,
    cartTotal: cart.total,
    confirmationSubTotal: confirmation.subTotal,
    confirmationShipping: confirmation.shipping,
    confirmationDiscount: confirmation.discount,
    confirmationTotal: confirmation.total,
}));

export default selector;
