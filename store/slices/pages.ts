import { createSlice } from '@reduxjs/toolkit';
import { HYDRATE } from 'next-redux-wrapper';

import pagesInitialState from '../state/pages';

const pagesSlice = createSlice({
    name: 'pages',
    initialState: pagesInitialState,
    reducers: {
        setPages(state, action) {
            state.pages = action.payload;
        },
        setLoadingPages(state, action) {
            state.isLoadingPages = action.payload;
        },
        resetPages() {
            return pagesInitialState;
        },
    },
    extraReducers: {
        [HYDRATE]: (state, action) => ({
            ...state,
            ...action.payload.subject,
        }),
    },
});

export const { setPages, setLoadingPages, resetPages } = pagesSlice.actions;
export default pagesSlice.reducer;
