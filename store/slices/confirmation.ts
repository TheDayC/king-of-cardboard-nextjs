import { createSlice } from '@reduxjs/toolkit';
import { HYDRATE } from 'next-redux-wrapper';

import confirmationInitialState from '../state/confirmation';

const confirmationSlice = createSlice({
    name: 'confirmation',
    initialState: confirmationInitialState,
    reducers: {
        setConfirmationData(state, action) {
            state.order = action.payload.order;
            state.items = action.payload.items;
            state.customerDetails = action.payload.customerDetails;
        },
        resetConfirmationDetails() {
            return confirmationInitialState;
        },
    },
    extraReducers: {
        [HYDRATE]: (state, action) => {
            console.log('HYDRATE', state, action.payload);
            return {
                ...state,
                ...action.payload.subject,
            };
        },
    },
});

export const { setConfirmationData, resetConfirmationDetails } = confirmationSlice.actions;

export default confirmationSlice.reducer;
