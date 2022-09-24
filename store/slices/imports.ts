import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { ImportsWithCount } from '../../types/imports';
import { getShallowImports } from '../../utils/imports';

import importsInitialState from '../state/imports';
import { IAppState } from '../types/state';

interface ImportsThunkInput {
    limit: number;
    skip: number;
}

export const fetchImports = createAsyncThunk(
    'imports/fetchImports',
    async (data: ImportsThunkInput, { getState }): Promise<ImportsWithCount | null> => {
        const { limit, skip } = data;
        const { global, filters } = getState() as IAppState;
        const { accessToken } = global;
        const { categories, productTypes } = filters;

        if (!accessToken) return null;

        return await getShallowImports(accessToken, limit, skip, categories, productTypes);
    }
);

const importsSlice = createSlice({
    name: 'imports',
    initialState: importsInitialState,
    reducers: {
        setIsLoadingImports(state, action) {
            state.isLoadingImports = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(fetchImports.fulfilled, (state, action) => {
            if (action.payload) {
                const { imports, count } = action.payload;

                state.imports = imports;
                state.importsTotal = count;
                state.isLoadingImports = false;
            }
        });
    },
});

export const { setIsLoadingImports } = importsSlice.actions;

export default importsSlice.reducer;
