import { createSelector } from '@reduxjs/toolkit';

import { selectCartData } from '../../store/state/selectors';

const selector = createSelector([selectCartData], (cart) => ({
    orderId: cart.orderId,
}));

export default selector;
