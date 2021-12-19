import { createSlice } from '@reduxjs/toolkit';
import { HYDRATE } from 'next-redux-wrapper';

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
        setShipmentsWithMethods(state, action) {
            return {
                ...state,
                shipmentsWithMethods: action.payload,
            };
        },
        addShipmentWithMethod(state, action) {
            const { shipmentId, methodId } = action.payload;
            const currentState = state.shipmentsWithMethods;

            if (currentState) {
                const existingIndex = currentState.findIndex((cS) => cS.shipmentId === shipmentId);

                state.shipmentsWithMethods = currentState.slice(existingIndex, existingIndex);

                state.shipmentsWithMethods.push({ shipmentId, methodId });
            } else {
                state.shipmentsWithMethods = [{ shipmentId, methodId }];
            }
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
    setAllowShippingAddress,
    setCustomerDetails,
    setShipmentsWithMethods,
    addShipmentWithMethod,
    resetCheckoutDetails,
} = checkoutSlice.actions;

export default checkoutSlice.reducer;
