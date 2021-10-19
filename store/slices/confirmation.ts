import { createSlice } from '@reduxjs/toolkit';

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
    extraReducers: (builder) => {
        builder.addDefaultCase((state) => state);
    },
});

export const { setConfirmationData, resetConfirmationDetails } = confirmationSlice.actions;

export default confirmationSlice.reducer;
