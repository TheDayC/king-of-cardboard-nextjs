import { createSelector } from '@reduxjs/toolkit';

import { selectFiltersData, selectProductData } from '../../store/state/selectors';

const selector = createSelector([selectProductData, selectFiltersData], (products, filters) => ({
    products,
    filters,
}));

export default selector;
