import { createSelector } from '@reduxjs/toolkit';

import { selectProductData, selectGlobalData, selectImportsData } from '../../../store/state/selectors';

const selector = createSelector([selectProductData, selectGlobalData, selectImportsData], (products) => ({
    products: products.products,
    productsTotal: products.productsTotal,
    isLoadingProducts: products.isLoadingProducts,
}));

export default selector;
