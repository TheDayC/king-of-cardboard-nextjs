import { createSelector } from '@reduxjs/toolkit';

import { selectGlobalData, selectCartData } from '../../../../../store/state/selectors';

const selector = createSelector([selectGlobalData, selectCartData], (global, cart) => ({
    accessToken: global.accessToken,
    orderId: cart.orderId,
    items: cart.items,
    shouldFetchOrder: cart.shouldFetchOrder,
}));

export default selector;
