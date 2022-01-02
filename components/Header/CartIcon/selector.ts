import { createSelector } from '@reduxjs/toolkit';

import { selectCartData, selectGlobalData } from '../../../store/state/selectors';

const selector = createSelector([selectCartData, selectGlobalData], (cart, global) => ({
    accessToken: global.accessToken,
    itemCount: cart.itemCount,
    orderId: cart.order ? cart.order.id : null,
}));

export default selector;
