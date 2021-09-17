import { createSlice } from '@reduxjs/toolkit';

import productsInitialState from '../state/products';

const productsSlice = createSlice({
    name: 'products',
    initialState: productsInitialState,
    reducers: {
        addProductCollection(state, action) {
            return action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            // and provide a default case if no other handlers matched
            .addDefaultCase((state) => state);
    },
});

export const { addProductCollection } = productsSlice.actions;
export default productsSlice.reducer;
