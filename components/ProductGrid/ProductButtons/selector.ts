import { createSelector } from '@reduxjs/toolkit';

import { selectCartData, selectProductData, selectGlobalData } from '../../../store/state/selectors';

const selector = createSelector([selectCartData, selectProductData, selectGlobalData], (cart, products, global) => ({
    items: cart.order ? cart.order.line_items : null,
    order: cart.order,
    products,
    accessToken: global.accessToken,
}));

export default selector;
