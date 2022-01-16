import { createSelector } from '@reduxjs/toolkit';

import { selectProductData } from '../../store/state/selectors';

const selector = createSelector([selectProductData], (products) => ({
    isLoadingProducts: products.isLoadingProducts,
}));

export default selector;
