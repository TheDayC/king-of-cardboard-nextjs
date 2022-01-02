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
        setShipmentsWithMethods(state, action) {
            state.shipmentsWithMethods = action.payload;
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
    setCustomerDetails,
    setBillingAddress,
    setShippingAddress,
    setCloneBillingAddressId,
    setCloneShippingAddressId,
    setSameAsBilling,
    setShipmentsWithMethods,
    addShipmentWithMethod,
    resetCheckoutDetails,
} = checkoutSlice.actions;

export default checkoutSlice.reducer;
