import { createSelector } from '@reduxjs/toolkit';

import { selectFiltersData } from '../../../../store/state/selectors';

const selector = createSelector([selectFiltersData], (filters) => ({
    sortOption: filters.sortOption,
}));

export default selector;
