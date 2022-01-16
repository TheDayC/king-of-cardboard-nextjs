import { createSelector } from '@reduxjs/toolkit';

import { selectGlobalData, selectCartData, selectProductData } from '../../store/state/selectors';

const selector = createSelector([selectGlobalData, selectCartData, selectProductData], (global, cart, products) => ({
    orderId: cart.orderId,
    items: cart.items,
    accessToken: global.accessToken,
    currentProduct: products.currentProduct,
}));

export default selector;
