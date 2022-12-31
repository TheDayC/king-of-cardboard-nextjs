import { createAction, createSlice } from '@reduxjs/toolkit';
import { uniq } from 'lodash';
import { HYDRATE } from 'next-redux-wrapper';

import { AppState } from '..';
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
        removeAllCategories(state) {
            state.categories = [];
        },
        removeAllConfigurations(state) {
            state.configurations = [];
        },
        removeAllInterests(state) {
            state.interests = [];
        },
        removeAllStockStatuses(state) {
            state.stockStatus = [];
        },
        setSearchTerm(state, action) {
            state.searchTerm = action.payload;
        },
        setSortOption(state, action) {
            state.sortOption = action.payload;
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
    removeAllCategories,
    removeAllConfigurations,
    removeAllInterests,
    addStockStatus,
    removeStockStatus,
    removeAllStockStatuses,
    setSearchTerm,
    setSortOption,
} = filtersSlice.actions;
export default filtersSlice.reducer;
