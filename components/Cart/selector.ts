import { createSelector } from '@reduxjs/toolkit';

import { selectCartData, selectGlobalData } from '../../store/state/selectors';

const selector = createSelector([selectCartData, selectGlobalData], (cart, global) => ({
    itemCount: cart.itemCount,
    items: cart.items,
    isUpdatingCart: cart.isUpdatingCart,
    accessToken: global.accessToken,
    orderId: cart.orderId,
    shouldUpdateCart: cart.shouldUpdateCart,
}));

export default selector;
