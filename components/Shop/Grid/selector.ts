import { createSelector } from '@reduxjs/toolkit';

import { selectFiltersData, selectProductData, selectGlobalData, selectShopData } from '../../../store/state/selectors';

const selector = createSelector(
    [selectProductData, selectFiltersData, selectGlobalData, selectShopData],
    (products, filters, global, shop) => ({
        products: products.products,
        productsTotal: products.productsTotal,
        categories: filters.categories,
        productTypes: filters.productTypes,
        accessToken: global.accessToken,
        currentPage: shop.currentPage,
    })
);

export default selector;
