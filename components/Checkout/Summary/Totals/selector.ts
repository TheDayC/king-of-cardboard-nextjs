import { createSelector } from '@reduxjs/toolkit';

import { selectCartData, selectConfirmationData } from '../../../../store/state/selectors';

const selector = createSelector([selectCartData, selectConfirmationData], (cart, confirmation) => ({
    cartSubTotal: cart.subTotal,
    cartShipping: cart.shipping,
    cartTotal: cart.total,
    confirmationSubTotal: confirmation.subTotal,
    confirmationShipping: confirmation.shipping,
    confirmationTotal: confirmation.total,
}));

export default selector;
