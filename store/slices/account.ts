import { createSlice } from '@reduxjs/toolkit';
import { HYDRATE } from 'next-redux-wrapper';

import accountInitialState from '../state/account';

const accountSlice = createSlice({
    name: 'account',
    initialState: accountInitialState,
    reducers: {
        setSocialMedia(state, action) {
            state.socialMedia = action.payload;
        },
        setBalance(state, action) {
            state.balance = action.payload;
        },
        setShouldFetchRewards(state, action) {
            state.shouldFetchRewards = action.payload;
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

export const { setSocialMedia, setBalance, setShouldFetchRewards } = accountSlice.actions;
export default accountSlice.reducer;
