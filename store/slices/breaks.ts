import { createAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { HYDRATE } from 'next-redux-wrapper';

import { AppState } from '..';
import { Break, SingleBreak } from '../../types/breaks';
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
    'products/fetchBreaks',
    async (data: BreaksThunkInput): Promise<Break[]> => {
        const { accessToken, limit, skip } = data;

        return await getBreaks(accessToken, limit, skip);
    }
);

export const fetchBreaksTotal = createAsyncThunk(
    'products/fetchBreaksTotal',
    async (): Promise<number> => await getBreaksTotal()
);

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
        builder.addCase(fetchBreaks.fulfilled, (state, action) => {
            state.breaks = action.payload;
        }),
            builder.addCase(fetchBreaksTotal.fulfilled, (state, action) => {
                state.breaksTotal = action.payload;
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

export const { setPage, setIsLoadingBreaks } = breakSlice.actions;
export default breakSlice.reducer;
