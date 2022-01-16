import { createAction, createSlice } from '@reduxjs/toolkit';
import { HYDRATE } from 'next-redux-wrapper';

import { AppState } from '..';
import shopInitialState from '../state/shop';

const hydrate = createAction<AppState>(HYDRATE);

const shopSlice = createSlice({
    name: 'shop',
    initialState: shopInitialState,
    reducers: {
        setIsLoadingProducts(state, action) {
            state.isLoadingProducts = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(hydrate, (state, action) => ({
            ...state,
            ...action.payload[shopSlice.name],
        }));
    },
});

export const { setIsLoadingProducts } = shopSlice.actions;
export default shopSlice.reducer;
