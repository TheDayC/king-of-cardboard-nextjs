import { createSelector } from '@reduxjs/toolkit';

import { selectCartData } from '../../../store/state/selectors';

const selector = createSelector([selectCartData], (cart) => ({
    order: cart.order,
    lineItems: cart.items,
}));

export default selector;
