import { createSlice } from '@reduxjs/toolkit';
import { HYDRATE } from 'next-redux-wrapper';

import filtersInitialState from '../state/filters';

const filtersSlice = createSlice({
    name: 'filters',
    initialState: filtersInitialState,
    reducers: {
        addProductType(state, action) {
            state.productTypes.push(action.payload);
        },
        removeProductType(state, action) {
            const productTypeIndex = state.productTypes.findIndex((type) => type === action.payload);

            state.productTypes.splice(productTypeIndex, 1);
        },
        setUrlProductType(state, action) {
            state.productTypes = [];
            state.productTypes.push(action.payload);
        },
        removeAllProductTypes(state) {
            state.productTypes = [];
        },
        addCategory(state, action) {
            state.categories.push(action.payload);
        },
        removeCategory(state, action) {
            const categoryIndex = state.categories.findIndex((cat) => cat === action.payload);

            state.categories.splice(categoryIndex, 1);
        },
        removeAllCategories(state) {
            state.categories = [];
        },
        resetFilters() {
            return filtersInitialState;
        },
    },
    extraReducers: {
        [HYDRATE]: (state, action) => ({
            ...state,
            ...action.payload.subject,
        }),
    },
});

export const {
    addProductType,
    removeProductType,
    setUrlProductType,
    removeAllProductTypes,
    addCategory,
    removeCategory,
    removeAllCategories,
    resetFilters,
} = filtersSlice.actions;
export default filtersSlice.reducer;
