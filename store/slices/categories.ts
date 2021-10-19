import { createSlice } from '@reduxjs/toolkit';

import categoriesInitialState from '../state/categories';

const categoriesSlice = createSlice({
    name: 'categories',
    initialState: categoriesInitialState,
    reducers: {
        fetchCategories() {
            // TODO: Fetch Categories
        },
        resetCategories() {
            return categoriesInitialState;
        },
    },
    extraReducers: (builder) => {
        builder.addDefaultCase((state) => state);
    },
});

export const { fetchCategories, resetCategories } = categoriesSlice.actions;
export default categoriesSlice.reducer;
