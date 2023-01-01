import { SortOption } from '../../enums/products';
import { Filters } from '../types/state';

const filtersInitialState: Filters = {
    categories: [],
    interests: [],
    configurations: [],
    stockStatus: [],
    searchTerm: '',
    sortOption: SortOption.DateAddedDesc,
};

export default filtersInitialState;
