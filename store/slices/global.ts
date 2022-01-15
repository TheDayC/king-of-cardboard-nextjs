import { createAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { HYDRATE } from 'next-redux-wrapper';

import { AppState } from '..';
import { CreateToken } from '../../types/commerce';
import { createToken } from '../../utils/auth';
import globalInitialState from '../state/global';

const hydrate = createAction<AppState>(HYDRATE);

export const fetchToken = createAsyncThunk('global/fetchToken', async (): Promise<CreateToken> => {
    return await createToken();
});

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
        setShowNewsBanner(state, action) {
            state.showNewsBanner = action.payload;
        },
    },
    extraReducers: (builder) => {
        // Add reducers for additional action types here, and handle loading state as needed
        builder.addCase(fetchToken.fulfilled, (state, action) => {
            const { token, expires } = action.payload;

            state.accessToken = token;
            state.expires = expires;
        }),
            builder.addCase(hydrate, (state, action) => ({
                ...state,
                ...action.payload[globalSlice.name],
            }));
    },
});

export const {
    setAccessToken,
    setExpires,
    setCheckoutLoading,
    setHasRejected,
    setSessionEmail,
    setShowNewsBanner,
    setUserToken,
} = globalSlice.actions;
export default globalSlice.reducer;
