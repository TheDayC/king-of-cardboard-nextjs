import { createSelector } from '@reduxjs/toolkit';
import { isEqual } from 'lodash';

import { SortOption } from '../../enums/products';
import { selectFiltersData } from '../../store/state/selectors';
import { DEFAULT_STOCK_STATUSES } from '../../utils/constants';

const selector = createSelector([selectFiltersData], (filters) => ({
    shouldShowRows:
        filters.categories.length === 0 &&
        filters.configurations.length === 0 &&
        filters.interests.length === 0 &&
        isEqual(filters.stockStatus, DEFAULT_STOCK_STATUSES),
    searchTerm: filters.searchTerm,
    sortOption: filters.sortOption,
    hasSearchTerm: filters.searchTerm.length > 0,
    hasNonDefaultSortOption: filters.sortOption !== SortOption.DateAddedDesc,
}));

export default selector;
