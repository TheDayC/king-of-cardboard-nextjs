import { createSelector } from '@reduxjs/toolkit';

import { selectFiltersData } from '../../store/state/selectors';

const selector = createSelector([selectFiltersData], (filters) => ({
    shouldShowRows:
        filters.categories.length === 0 && filters.configurations.length === 0 && filters.interests.length === 0,
    searchTerm: filters.searchTerm,
    sortOption: filters.sortOption,
    hasSearchTerm: filters.searchTerm.length > 0,
}));

export default selector;
