import { createAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { HYDRATE } from 'next-redux-wrapper';

import { AppState } from '..';
import { SingleBreak } from '../../types/breaks';
import { getSingleBreak } from '../../utils/breaks';
import breaksInitialState from '../state/breaks';

const hydrate = createAction<AppState>(HYDRATE);

interface SingleBreakThunkInput {
    accessToken: string;
    slug: string;
}

export const fetchSingleBreak = createAsyncThunk(
    'products/fetchSingleBreak',
    async (data: SingleBreakThunkInput): Promise<SingleBreak> => {
        const { accessToken, slug } = data;

        return await getSingleBreak(accessToken, slug);
    }
);

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
        // Add reducers for additional action types here, and handle loading state as needed
        builder.addCase(fetchSingleBreak.fulfilled, (state, action) => {
            state.currentBreak = action.payload;
        }),
            builder.addCase(hydrate, (state, action) => ({
                ...state,
                ...action.payload[breakSlice.name],
            }));
    },
});

export const { setPage, setIsLoadingBreaks } = breakSlice.actions;
export default breakSlice.reducer;
