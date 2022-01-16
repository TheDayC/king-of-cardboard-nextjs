import { createAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { HYDRATE } from 'next-redux-wrapper';

import { AppState } from '..';
import { Break, BreaksWithCount, SingleBreak } from '../../types/breaks';
import { getBreaks, getBreaksTotal, getSingleBreak } from '../../utils/breaks';
import breaksInitialState from '../state/breaks';

const hydrate = createAction<AppState>(HYDRATE);

interface BreaksThunkInput {
    accessToken: string;
    limit: number;
    skip: number;
}

interface SingleBreakThunkInput {
    accessToken: string;
    slug: string;
}

export const fetchBreaks = createAsyncThunk(
    'breaks/fetchBreaks',
    async (data: BreaksThunkInput): Promise<BreaksWithCount> => {
        const { accessToken, limit, skip } = data;

        return await getBreaks(accessToken, limit, skip);
    }
);

export const fetchSingleBreak = createAsyncThunk(
    'breaks/fetchSingleBreak',
    async (data: SingleBreakThunkInput): Promise<SingleBreak> => {
        const { accessToken, slug } = data;

        return await getSingleBreak(accessToken, slug);
    }
);

const breakSlice = createSlice({
    name: 'breaks',
    initialState: breaksInitialState,
    reducers: {
        setIsLoadingBreaks(state, action) {
            state.isLoadingBreaks = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(fetchBreaks.fulfilled, (state, action) => {
            const { breaks, count } = action.payload;

            state.breaks = breaks;
            state.breaksTotal = count;
            state.isLoadingBreaks = false;
        }),
            builder.addCase(fetchSingleBreak.fulfilled, (state, action) => {
                state.currentBreak = action.payload;
            }),
            builder.addCase(hydrate, (state, action) => ({
                ...state,
                ...action.payload[breakSlice.name],
            }));
    },
});

export const { setIsLoadingBreaks } = breakSlice.actions;
export default breakSlice.reducer;
