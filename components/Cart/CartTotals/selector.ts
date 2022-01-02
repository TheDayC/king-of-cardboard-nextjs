import { createSelector } from '@reduxjs/toolkit';

import { selectCartData } from '../../../store/state/selectors';

const selector = createSelector([selectCartData], (cart) => ({
    subTotal: cart.subTotal,
    shipping: cart.shipping,
    total: cart.total,
    items: cart.items,
}));

export default selector;
