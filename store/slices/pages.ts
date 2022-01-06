import { createAction, createSlice } from '@reduxjs/toolkit';
import { HYDRATE } from 'next-redux-wrapper';

import { AppState } from '..';
import pagesInitialState from '../state/pages';

const hydrate = createAction<AppState>(HYDRATE);

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
        setShouldLoadPages(state, action) {
            state.shouldLoadPages = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(hydrate, (state, action) => ({
            ...state,
            ...action.payload[pagesSlice.name],
        }));
    },
});

export const { setPages, setLoadingPages, setShouldLoadPages } = pagesSlice.actions;
export default pagesSlice.reducer;
