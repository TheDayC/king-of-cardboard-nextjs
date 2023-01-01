import { createAction, createSlice } from '@reduxjs/toolkit';
import { HYDRATE } from 'next-redux-wrapper';

import { AppState } from '..';
import confirmationInitialState from '../state/confirmation';

const hydrate = createAction<AppState>(HYDRATE);

const confirmationSlice = createSlice({
    name: 'confirmation',
    initialState: confirmationInitialState,
    reducers: {
        setConfirmationData(state, action) {
            const {
                subTotal,
                shipping,
                discount,
                total,
                orderNumber,
                items,
                customerDetails,
                billingAddress,
                shippingAddress,
            } = action.payload;

            state.subTotal = subTotal;
            state.shipping = shipping;
            state.total = total;
            state.discount = discount;
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
    extraReducers: (builder) => {
        builder.addCase(hydrate, (state, action) => ({
            ...state,
            ...action.payload[confirmationSlice.name],
        }));
    },
});

export const { setConfirmationData, resetConfirmationDetails } = confirmationSlice.actions;

export default confirmationSlice.reducer;
