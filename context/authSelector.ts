import { createSelector } from '@reduxjs/toolkit';

import { selectGlobalData, selectCartData } from '../store/state/selectors';

const selector = createSelector([selectGlobalData, selectCartData], (global, cart) => ({
    accessToken: global.accessToken,
    expires: global.expires,
    shouldCreateOrder: cart.shouldCreateOrder,
}));

export default selector;
