import { createSlice } from '@reduxjs/toolkit';
import { HYDRATE } from 'next-redux-wrapper';

import confirmationInitialState from '../state/confirmation';

const confirmationSlice = createSlice({
    name: 'confirmation',
    initialState: confirmationInitialState,
    reducers: {
        setConfirmationData(state, action) {
            const { subTotal, shipping, total, orderNumber, items, customerDetails, billingAddress, shippingAddress } =
                action.payload;
            state.subTotal = subTotal;
            state.shipping = shipping;
            state.total = total;
            state.orderNumber = orderNumber;
            state.items = items;
            state.customerDetails = customerDetails;
            state.billingAddress = billingAddress;
            state.shippingAddress = shippingAddress;
        },
        resetConfirmationDetails() {
            return confirmationInitialState;
        },
    },
    extraReducers: {
        [HYDRATE]: (state, action) => ({
            ...state,
            ...action.payload.subject,
        }),
    },
});

export const { setConfirmationData, resetConfirmationDetails } = confirmationSlice.actions;

export default confirmationSlice.reducer;
