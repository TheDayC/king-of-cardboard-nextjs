import { createSelector } from '@reduxjs/toolkit';

import { selectProductTypeData, selectCategoryData, selectFiltersData } from '../../../store/state/selectors';

const selector = createSelector(
    [selectCategoryData, selectProductTypeData, selectFiltersData],
    (categories, productTypes, filters) => ({
        categories,
        productTypes,
        filters,
        hasProductTypes: productTypes.length > 0,
        hasCategories: categories.length > 0,
    })
);

export default selector;
