import { createSelector } from '@reduxjs/toolkit';

import { selectGlobalData, selectCartData } from '../../store/state/selectors';

const selector = createSelector([selectGlobalData, selectCartData], (global, cart) => ({
    orderId: cart.orderId,
    items: cart.items,
    accessToken: global.accessToken,
    isUpdatingCart: cart.isUpdatingCart,
}));

export default selector;
