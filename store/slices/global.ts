import { createAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { HYDRATE } from 'next-redux-wrapper';
import { PURGE } from 'redux-persist';

import { AppState } from '..';
import { CreateToken } from '../../types/commerce';
import { createToken } from '../../utils/auth';
import globalInitialState from '../state/global';

const hydrate = createAction<AppState>(HYDRATE);
const purge = createAction<AppState>(PURGE);

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
        setShowNewsBanner(state, action) {
            state.showNewsBanner = action.payload;
        },
        setIsDrawerOpen(state, action) {
            state.isDrawerOpen = action.payload;
        },
        setTokenExpiry(state, action) {
            state.expires = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(fetchToken.pending, (state) => {
            state.isFetchingToken = true;
        }),
            builder.addCase(fetchToken.rejected, (state) => {
                state.isFetchingToken = false;
            }),
            builder.addCase(fetchToken.fulfilled, (state, action) => {
                const { token, expires } = action.payload;

                state.accessToken = token;
                state.expires = expires;
                state.isFetchingToken = false;
            }),
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
    setShowNewsBanner,
    setUserToken,
    setUserTokenExpiry,
    setUserId,
    setIsDrawerOpen,
    setTokenExpiry,
} = globalSlice.actions;
export default globalSlice.reducer;
