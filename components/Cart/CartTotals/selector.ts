import { createSelector } from '@reduxjs/toolkit';

import { selectCartData, selectConfirmationData } from '../../../store/state/selectors';

const selector = createSelector([selectCartData, selectConfirmationData], (cart, confirmation) => ({
    cartOrder: cart.order,
    confirmationOrder: confirmation.order,
}));

export default selector;
