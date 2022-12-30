import { createAction, createSlice } from '@reduxjs/toolkit';
import { HYDRATE } from 'next-redux-wrapper';

import { AppState } from '..';
import breaksInitialState from '../state/breaks';

const hydrate = createAction<AppState>(HYDRATE);

const breakSlice = createSlice({
    name: 'breaks',
    initialState: breaksInitialState,
    reducers: {
        setIsLoadingBreaks(state, action) {
            state.isLoadingBreaks = action.payload;
        },
        setIsLoadingBreak(state, action) {
            state.isLoadingBreak = action.payload;
        },
        setOrder(state, action) {
            state.order = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(hydrate, (state, action) => ({
            ...state,
            ...action.payload[breakSlice.name],
        }));
    },
});

export const { setIsLoadingBreaks, setIsLoadingBreak, setOrder } = breakSlice.actions;
export default breakSlice.reducer;
