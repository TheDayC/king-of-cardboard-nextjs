import { createSlice } from '@reduxjs/toolkit';

import productTypeInitialState from '../state/productType';

const productTypeSlice = createSlice({
    name: 'productTypes',
    initialState: productTypeInitialState,
    reducers: {
        fetchProductTypes() {
            // TODO: Fetch Categories
        },
    },
    extraReducers: (builder) => {
        builder.addDefaultCase((state) => state);
    },
});

export const { fetchProductTypes } = productTypeSlice.actions;
export default productTypeSlice.reducer;
