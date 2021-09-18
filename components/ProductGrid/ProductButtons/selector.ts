import { createSelector } from '@reduxjs/toolkit';

import { selectCartData, selectProductData } from '../../../store/state/selectors';

const selector = createSelector([selectCartData, selectProductData], (cart, products) => ({
    cart,
    products,
}));

export default selector;
