import { createSelector } from '@reduxjs/toolkit';

import { selectFiltersData, selectProductData, selectShopData } from '../../../store/state/selectors';

const selector = createSelector([selectProductData, selectFiltersData, selectShopData], (products, filters, shop) => ({
    products,
    filters,
    currentPage: shop.currentPage,
}));

export default selector;
