import { createSelector } from '@reduxjs/toolkit';

import { selectFiltersData } from '../../store/state/selectors';

const selector = createSelector([selectFiltersData], (filters) => ({
    shouldShowRows: filters.categories.length === 0 && filters.productTypes.length === 0,
}));

export default selector;