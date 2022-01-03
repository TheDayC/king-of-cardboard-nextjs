import { createSelector } from '@reduxjs/toolkit';

import { selectCartData } from '../../../store/state/selectors';

const selector = createSelector([selectCartData], (cart) => ({
    subTotal: cart.subTotal,
    shipping: cart.shipping,
    discount: cart.discount,
    total: cart.total,
}));

export default selector;
