import { createSlice } from '@reduxjs/toolkit';
import { HYDRATE } from 'next-redux-wrapper';

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
    extraReducers: {
        [HYDRATE]: (state, action) => {
            console.log('HYDRATE', state, action.payload);
            return {
                ...state,
                ...action.payload.subject,
            };
        },
    },
});

export const { fetchCategories, resetCategories } = categoriesSlice.actions;
export default categoriesSlice.reducer;
