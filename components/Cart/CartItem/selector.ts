import { createSelector } from '@reduxjs/toolkit';

import { selectCartData, selectGlobalData, selectProductData } from '../../../store/state/selectors';

const selector = createSelector([selectCartData, selectProductData, selectGlobalData], (cart, products, global) => ({
    products,
    accessToken: global.accessToken,
}));

export default selector;
