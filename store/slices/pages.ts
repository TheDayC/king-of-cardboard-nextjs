import { createSlice } from '@reduxjs/toolkit';

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
    extraReducers: (builder) => {
        builder.addDefaultCase((state) => state);
    },
});

export const { setPages, setLoadingPages, resetPages } = pagesSlice.actions;
export default pagesSlice.reducer;
