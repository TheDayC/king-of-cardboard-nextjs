import { createSlice } from '@reduxjs/toolkit';
import { HYDRATE } from 'next-redux-wrapper';

import shopInitialState from '../state/shop';

const shopSlice = createSlice({
    name: 'shop',
    initialState: shopInitialState,
    reducers: {
        setPage(state, action) {
            state.currentPage = action.payload;
        },
        setIsLoadingProducts(state, action) {
            state.isLoadingProducts = action.payload;
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

export const { setPage, setIsLoadingProducts } = shopSlice.actions;
export default shopSlice.reducer;
