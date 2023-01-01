import { createAction, createSlice } from '@reduxjs/toolkit';
import { uniq } from 'lodash';
import { HYDRATE } from 'next-redux-wrapper';

import { AppState } from '..';
import { SortOption } from '../../enums/products';
import { DEFAULT_STOCK_STATUSES } from '../../utils/constants';
import filtersInitialState from '../state/filters';

const hydrate = createAction<AppState>(HYDRATE);

const filtersSlice = createSlice({
    name: 'filters',
    initialState: filtersInitialState,
    reducers: {
        addCategory(state, action) {
            state.categories = uniq([...state.categories, action.payload]);
        },
        addConfiguration(state, action) {
            state.configurations = uniq([...state.configurations, action.payload]);
        },
        addInterest(state, action) {
            state.interests = uniq([...state.interests, action.payload]);
        },
        addStockStatus(state, action) {
            state.stockStatus = uniq([...state.stockStatus, action.payload]);
        },
        setSearchTerm(state, action) {
            state.searchTerm = action.payload;
        },
        setSortOption(state, action) {
            state.sortOption = action.payload;
        },
        setStaticPageInterest(state, action) {
            state.interests = uniq([...state.interests, action.payload]);
        },
        removeCategory(state, action) {
            state.categories = state.categories.filter((category) => category !== action.payload);
        },
        removeConfiguration(state, action) {
            state.configurations = state.configurations.filter((configuration) => configuration !== action.payload);
        },
        removeInterest(state, action) {
            state.interests = state.interests.filter((interest) => interest !== action.payload);
        },
        removeStockStatus(state, action) {
            state.stockStatus = state.stockStatus.filter((status) => status !== action.payload);
        },
        resetFilters(state) {
            state.categories = [];
            state.configurations = [];
            state.interests = [];
            state.stockStatus = DEFAULT_STOCK_STATUSES;
            state.searchTerm = '';
            state.sortOption = SortOption.DateAddedDesc;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(hydrate, (state, action) => ({
            ...state,
            ...action.payload[filtersSlice.name],
        }));
    },
});

export const {
    addCategory,
    addConfiguration,
    addInterest,
    removeCategory,
    removeConfiguration,
    removeInterest,
    setStaticPageInterest,
    addStockStatus,
    removeStockStatus,
    setSearchTerm,
    setSortOption,
    resetFilters,
} = filtersSlice.actions;
export default filtersSlice.reducer;
