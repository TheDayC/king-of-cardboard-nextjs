import { createSelector } from '@reduxjs/toolkit';

import { selectCartData, selectGlobalData } from '../../../store/state/selectors';

const selector = createSelector([selectCartData, selectGlobalData], (cart, global) => ({
    order: cart.order,
    lineItems: cart.items,
    checkoutLoading: global.checkoutLoading,
}));

export default selector;
