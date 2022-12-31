import { createSelector } from '@reduxjs/toolkit';

import { selectFiltersData } from '../../../store/state/selectors';

const selector = createSelector([selectFiltersData], (filters) => ({
    searchTerm: filters.searchTerm,
}));

export default selector;
