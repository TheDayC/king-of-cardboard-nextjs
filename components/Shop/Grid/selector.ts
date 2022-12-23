import { createSelector } from '@reduxjs/toolkit';

import { selectProductData } from '../../../store/state/selectors';

const selector = createSelector([selectProductData], (products) => ({
    products: products.products,
    productsTotal: products.productsTotal,
    isLoadingProducts: products.isLoadingProducts,
}));

export default selector;
