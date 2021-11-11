import { createSlice } from '@reduxjs/toolkit';
import { HYDRATE } from 'next-redux-wrapper';

import productTypeInitialState from '../state/productType';

const productTypeSlice = createSlice({
    name: 'productTypes',
    initialState: productTypeInitialState,
    reducers: {
        fetchProductTypes() {
            // TODO: Fetch Categories
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

export const { fetchProductTypes } = productTypeSlice.actions;
export default productTypeSlice.reducer;
