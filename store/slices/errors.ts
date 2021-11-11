import { createSlice } from '@reduxjs/toolkit';
// import { HYDRATE } from 'next-redux-wrapper';

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
    /* extraReducers: {
        [HYDRATE]: (state, action) => {
            console.log('HYDRATE', state, action.payload);
            return {
                ...state,
                ...action.payload.subject,
            };
        },
    }, */
});

export const { addError, clearErrors } = errorsSlice.actions;
export default errorsSlice.reducer;
