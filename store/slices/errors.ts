import { createSlice } from '@reduxjs/toolkit';

import errorsInitialState from '../state/errors';

const errorsSlice = createSlice({
    name: 'errors',
    initialState: errorsInitialState,
    reducers: {
        addError(state, action) {
            return action.payload;
        },
        clearErrors() {
            return null;
        },
    },
    extraReducers: (builder) => {
        builder.addDefaultCase((state) => state);
    },
});

export const { addError, clearErrors } = errorsSlice.actions;
export default errorsSlice.reducer;
