import { createSlice } from '@reduxjs/toolkit';

import categoriesInitialState from '../state/categories';

const categoriesSlice = createSlice({
    name: 'categories',
    initialState: categoriesInitialState,
    reducers: {
        fetchCategories() {
            // TODO: Fetch Categories
        },
    },
    extraReducers: (builder) => {
        builder.addDefaultCase((state) => state);
    },
});

export const { fetchCategories } = categoriesSlice.actions;
export default categoriesSlice.reducer;
