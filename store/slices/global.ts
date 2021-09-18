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
    },
    extraReducers: (builder) => {
        builder.addDefaultCase((state) => state);
    },
});

export const { setAccessToken, setExpires } = globalSlice.actions;
export default globalSlice.reducer;
