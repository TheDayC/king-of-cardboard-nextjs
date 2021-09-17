import { createSlice } from '@reduxjs/toolkit';

import globalInitialState from '../state/global';

const globalSlice = createSlice({
    name: 'global',
    initialState: globalInitialState,
    reducers: {
        setNavValue(state, action) {
            state.currentNavItem = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder.addDefaultCase((state) => state);
    },
});

export const { setNavValue } = globalSlice.actions;
export default globalSlice.reducer;
