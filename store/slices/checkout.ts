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
        setHasCompletedOrder(state, action) {
            state.hasCompletedOrder = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder.addDefaultCase((state) => state);
    },
});

export const {
    setCurrentStep,
    setAllowShippingAddress,
    setCustomerDetails,
    setShipmentsWithMethods,
    addShipmentWithMethod,
    setHasCompletedOrder,
} = checkoutSlice.actions;

export default checkoutSlice.reducer;
