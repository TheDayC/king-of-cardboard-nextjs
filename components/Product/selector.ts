import { createSelector } from '@reduxjs/toolkit';

import { selectGlobalData, selectCartData } from '../../store/state/selectors';

const selector = createSelector([selectGlobalData, selectCartData], (global, cart) => ({
    items: cart.items,
    isUpdatingCart: cart.isUpdatingCart,
}));

export default selector;
