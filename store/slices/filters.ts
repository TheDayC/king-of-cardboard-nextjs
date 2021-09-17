import { createSlice } from '@reduxjs/toolkit';

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
    },
    extraReducers: (builder) => {
        builder.addDefaultCase((state) => state);
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
} = filtersSlice.actions;
export default filtersSlice.reducer;
