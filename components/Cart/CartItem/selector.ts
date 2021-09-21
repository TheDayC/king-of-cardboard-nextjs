import { createSelector } from '@reduxjs/toolkit';

import { selectCartData, selectProductData } from '../../../store/state/selectors';

const selector = createSelector([selectCartData, selectProductData], (cart, products) => ({
    order: cart.order,
    products,
}));

export default selector;
