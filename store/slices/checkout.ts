import { createSlice } from '@reduxjs/toolkit';

import checkoutInitialState from '../state/checkout';

const checkoutSlice = createSlice({
    name: 'checkout',
    initialState: checkoutInitialState,
    reducers: {
        setCurrentStep(state, action) {
            return {
                ...state,
                currentStep: action.payload,
            };
        },
        setAllowShippingAddress(state, action) {
            return {
                ...state,
                customerDetails: {
                    ...state.customerDetails,
                    allowShippingAddress: action.payload,
                },
            };
        },
        setCustomerDetails(state, action) {
            return {
                ...state,
                customerDetails: {
                    ...state.customerDetails,
                    ...action.payload,
                },
            };
        },
    },
    extraReducers: (builder) => {
        builder.addDefaultCase((state) => state);
    },
});

export const { setCurrentStep, setAllowShippingAddress, setCustomerDetails } = checkoutSlice.actions;

export default checkoutSlice.reducer;
