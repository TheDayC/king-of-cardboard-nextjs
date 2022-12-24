import { createSelector } from '@reduxjs/toolkit';

import { selectCartData } from '../../../../../store/state/selectors';

const selector = createSelector([selectCartData], (cart) => ({
    items: cart.items,
}));

export default selector;
