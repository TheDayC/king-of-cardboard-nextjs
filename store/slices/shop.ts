import { createSlice } from '@reduxjs/toolkit';

import shopInitialState from '../state/shop';

const shopSlice = createSlice({
    name: 'shop',
    initialState: shopInitialState,
    reducers: {
        setPage(state, action) {
            state.currentPage = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            // and provide a default case if no other handlers matched
            .addDefaultCase((state) => state);
    },
});

export const { setPage } = shopSlice.actions;
export default shopSlice.reducer;
