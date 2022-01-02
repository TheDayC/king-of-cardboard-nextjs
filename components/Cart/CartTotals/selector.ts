import { createSelector } from '@reduxjs/toolkit';

import { selectCartData, selectGlobalData } from '../../../store/state/selectors';

const selector = createSelector([selectCartData, selectGlobalData], (cart, global) => ({
    orderId: cart.orderId,
    accessToken: global.accessToken,
    subTotal: cart.subTotal,
    shipping: cart.shipping,
    total: cart.total,
}));

export default selector;
