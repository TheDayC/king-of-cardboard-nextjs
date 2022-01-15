import { createAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { HYDRATE } from 'next-redux-wrapper';

import { AppState } from '..';
import { MergedShipmentMethods, Shipment } from '../../types/checkout';
import { getPaymentMethods, getShipments, getShippingMethods } from '../../utils/checkout';
import checkoutInitialState from '../state/checkout';
import { PaymentMethod, CommonThunkInput } from '../types/state';

const hydrate = createAction<AppState>(HYDRATE);

export const fetchPaymentMethods = createAsyncThunk(
    'checkout/fetchPaymentMethods',
    async (data: CommonThunkInput): Promise<PaymentMethod[]> => {
        const { accessToken, orderId } = data;

        return await getPaymentMethods(accessToken, orderId);
    }
);

export const fetchShipments = createAsyncThunk(
    'checkout/fetchShipments',
    async (data: CommonThunkInput): Promise<Shipment[]> => {
        const { accessToken, orderId } = data;

        return await getShipments(accessToken, orderId);
    }
);

export const fetchShippingMethods = createAsyncThunk(
    'checkout/fetchShippingMethods',
    async (data: CommonThunkInput): Promise<MergedShipmentMethods[]> => {
        const { accessToken, orderId } = data;

        return await getShippingMethods(accessToken, orderId);
    }
);

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
    extraReducers: (builder) => {
        builder.addCase(fetchPaymentMethods.fulfilled, (state, action) => {
            state.paymentMethods = action.payload;
        }),
            builder.addCase(fetchShipments.fulfilled, (state, action) => {
                state.shipments = action.payload;
            }),
            builder.addCase(fetchShippingMethods.fulfilled, (state, action) => {
                state.shippingMethods = action.payload;
            }),
            builder.addCase(hydrate, (state, action) => ({
                ...state,
                ...action.payload[checkoutSlice.name],
            }));
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
    resetCheckoutDetails,
} = checkoutSlice.actions;

export default checkoutSlice.reducer;
