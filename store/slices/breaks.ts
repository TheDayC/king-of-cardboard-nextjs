import { createSlice } from '@reduxjs/toolkit';
import { HYDRATE } from 'next-redux-wrapper';

import breaksInitialState from '../state/breaks';

const breakSlice = createSlice({
    name: 'breaks',
    initialState: breaksInitialState,
    reducers: {
        setPage(state, action) {
            state.currentPage = action.payload;
        },
        setIsLoadingBreaks(state, action) {
            state.isLoadingBreaks = action.payload;
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

export const { setPage, setIsLoadingBreaks } = breakSlice.actions;
export default breakSlice.reducer;
