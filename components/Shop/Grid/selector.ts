import { createSelector } from '@reduxjs/toolkit';

import { selectFiltersData, selectProductData, selectGlobalData } from '../../../store/state/selectors';

const selector = createSelector(
    [selectProductData, selectFiltersData, selectGlobalData],
    (products, filters, global) => ({
        products: products.products,
        productsTotal: products.productsTotal,
        accessToken: global.accessToken,
        isLoadingProducts: products.isLoadingProducts,
    })
);

export default selector;
