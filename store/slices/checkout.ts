import { createSlice } from '@reduxjs/toolkit';
import { HYDRATE } from 'next-redux-wrapper';

import checkoutInitialState from '../state/checkout';

const checkoutSlice = createSlice({
    name: 'checkout',
    initialState: checkoutInitialState,
    reducers: {
        setCurrentStep(state, action) {
            state.currentStep = action.payload;
        },
        setCustomerDetails(state, action) {
            state.customerDetails = action.payload;
        },
        setBillingAddress(state, action) {
            state.billingAddress = action.payload;
        },
        setShippingAddress(state, action) {
            state.shippingAddress = action.payload;
        },
        setCloneBillingAddressId(state, action) {
            state.cloneBillingAddressId = action.payload;
        },
        setCloneShippingAddressId(state, action) {
            state.cloneShippingAddressId = action.payload;
        },
        setSameAsBilling(state, action) {
            state.isShippingSameAsBilling = action.payload;
        },
        resetCheckoutDetails() {
            return checkoutInitialState;
        },
    },
    extraReducers: {
        [HYDRATE]: (state, action) => ({
            ...state,
            ...action.payload.subject,
        }),
    },
});

export const {
    setCurrentStep,
    setCustomerDetails,
    setBillingAddress,
    setShippingAddress,
    resetCheckoutDetails,
    setCloneBillingAddressId,
    setCloneShippingAddressId,
    setSameAsBilling,
} = checkoutSlice.actions;

export default checkoutSlice.reducer;
