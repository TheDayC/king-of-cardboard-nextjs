import { createAction, createSlice } from '@reduxjs/toolkit';
import { HYDRATE } from 'next-redux-wrapper';
import { PURGE } from 'redux-persist';

import { AppState } from '..';
import globalInitialState from '../state/global';

const hydrate = createAction<AppState>(HYDRATE);
const purge = createAction<AppState>(PURGE);

const globalSlice = createSlice({
    name: 'global',
    initialState: globalInitialState,
    reducers: {
        setAccessToken(state, action) {
            state.accessToken = action.payload;
        },
        setUserToken(state, action) {
            state.userToken = action.payload;
        },
        setUserTokenExpiry(state, action) {
            state.userTokenExpiry = action.payload;
        },
        setUserId(state, action) {
            state.userId = action.payload;
        },
        setExpires(state, action) {
            state.expires = action.payload;
        },
        setCheckoutLoading(state, action) {
            state.checkoutLoading = action.payload;
        },
        setHasRejected(state, action) {
            state.hasRejected = action.payload;
        },
        setSessionEmail(state, action) {
            state.sessionEmail = action.payload;
        },
        setIsDrawerOpen(state, action) {
            state.isDrawerOpen = action.payload;
        },
        setTokenExpiry(state, action) {
            state.expires = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(hydrate, (state, action) => ({
            ...state,
            ...action.payload[globalSlice.name],
        })),
            builder.addCase(purge, () => {
                return globalInitialState;
            });
    },
});

export const {
    setAccessToken,
    setExpires,
    setCheckoutLoading,
    setHasRejected,
    setSessionEmail,
    setUserToken,
    setUserTokenExpiry,
    setUserId,
    setIsDrawerOpen,
    setTokenExpiry,
} = globalSlice.actions;
export default globalSlice.reducer;
