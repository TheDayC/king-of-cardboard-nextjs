import { createSelector } from '@reduxjs/toolkit';

import { selectGlobalData, selectCartData, selectProductData } from '../store/state/selectors';

const selector = createSelector([selectGlobalData, selectCartData, selectProductData], (global, cart, products) => ({
    accessToken: global.accessToken,
    expires: global.expires,
    shouldSetNewOrder: global.shouldSetNewOrder,
    order: cart.order,
    products,
    shouldFetchOrder: cart.shouldFetchOrder,
}));

export default selector;
