import { createSlice } from '@reduxjs/toolkit';

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
    },
    extraReducers: (builder) => {
        builder.addDefaultCase((state) => state);
    },
});

export const { setAccessToken, setExpires, setCheckoutLoading } = globalSlice.actions;
export default globalSlice.reducer;
