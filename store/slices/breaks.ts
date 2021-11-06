import { createSlice } from '@reduxjs/toolkit';

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
    extraReducers: (builder) => {
        builder
            // and provide a default case if no other handlers matched
            .addDefaultCase((state) => state);
    },
});

export const { setPage, setIsLoadingBreaks } = breakSlice.actions;
export default breakSlice.reducer;
