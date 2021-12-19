import { createSlice } from '@reduxjs/toolkit';
import { HYDRATE } from 'next-redux-wrapper';

import errorsInitialState from '../state/errors';

const errorsSlice = createSlice({
    name: 'errors',
    initialState: errorsInitialState,
    reducers: {
        addError(state, action) {
            if (!state.errors) {
                state.errors = [];
            }

            state.errors.push(action.payload);
        },
    },
    extraReducers: {
        [HYDRATE]: (state, action) => ({
            ...state,
            ...action.payload.subject,
        }),
    },
});

export const { addError } = errorsSlice.actions;
export default errorsSlice.reducer;
