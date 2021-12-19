import { createSlice } from '@reduxjs/toolkit';
import { HYDRATE } from 'next-redux-wrapper';

import productsInitialState from '../state/products';

const productsSlice = createSlice({
    name: 'products',
    initialState: productsInitialState,
    reducers: {
        addSkuItems(state, action) {
            return action.payload;
        },
    },
    extraReducers: {
        [HYDRATE]: (state, action) => ({
            ...state,
            ...action.payload.subject,
        }),
    },
});

export const { addSkuItems } = productsSlice.actions;
export default productsSlice.reducer;
