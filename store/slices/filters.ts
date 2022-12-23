import { createAction, createSlice } from '@reduxjs/toolkit';
import { HYDRATE } from 'next-redux-wrapper';

import { AppState } from '..';
import filtersInitialState from '../state/filters';

const hydrate = createAction<AppState>(HYDRATE);

const filtersSlice = createSlice({
    name: 'filters',
    initialState: filtersInitialState,
    reducers: {
        addCategory(state, action) {
            state.categories.push(action.payload);
        },
        addConfiguration(state, action) {
            state.configurations.push(action.payload);
        },
        addInterest(state, action) {
            state.interests.push(action.payload);
        },
        addStockStatus(state, action) {
            state.stockStatus.push(action.payload);
        },
        setStaticPageInterest(state, action) {
            state.interests = [];
            state.interests.push(action.payload);
        },
        removeCategory(state, action) {
            const index = state.categories.findIndex((type) => type === action.payload);

            state.categories.splice(index, 1);
        },
        removeConfiguration(state, action) {
            const index = state.configurations.findIndex((type) => type === action.payload);

            state.configurations.splice(index, 1);
        },
        removeInterest(state, action) {
            const index = state.interests.findIndex((type) => type === action.payload);

            state.interests.splice(index, 1);
        },
        removeStockStatus(state, action) {
            const index = state.stockStatus.findIndex((type) => type === action.payload);

            state.stockStatus.splice(index, 1);
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
} = filtersSlice.actions;
export default filtersSlice.reducer;
