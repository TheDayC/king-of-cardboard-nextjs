import { createSelector } from '@reduxjs/toolkit';

import { selectCartData } from '../../../store/state/selectors';

const selector = createSelector([selectCartData], (cart) => ({
    itemCount: cart.items.length,
}));

export default selector;
