import { createSlice } from '@reduxjs/toolkit';
import { HYDRATE } from 'next-redux-wrapper';

import globalInitialState from '../state/global';

const globalSlice = createSlice({
    name: 'global',
    initialState: globalInitialState,
    reducers: {
        setAccessToken(state, action) {
            state.accessToken = action.payload;
        },
        setExpires(state, action) {
            state.expires = action.payload;
        },
        setCheckoutLoading(state, action) {
            state.checkoutLoading = action.payload;
        },
        setNewOrder(state, action) {
            state.shouldSetNewOrder = action.payload;
        },
        setShowDrawer(state, action) {
            state.shouldShowDrawer = action.payload;
        },
    },
    extraReducers: {
        [HYDRATE]: (state, action) => ({
            ...state,
            ...action.payload.subject,
        }),
    },
});

export const { setAccessToken, setExpires, setCheckoutLoading, setNewOrder, setShowDrawer } = globalSlice.actions;
export default globalSlice.reducer;
