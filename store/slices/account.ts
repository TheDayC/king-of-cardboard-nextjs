import { createSlice } from '@reduxjs/toolkit';

import accountInitialState from '../state/account';

const accountSlice = createSlice({
    name: 'account',
    initialState: accountInitialState,
    reducers: {
        setSocialMedia(state, action) {
            state.socialMedia = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            // and provide a default case if no other handlers matched
            .addDefaultCase((state) => state);
    },
});

export const { setSocialMedia } = accountSlice.actions;
export default accountSlice.reducer;
