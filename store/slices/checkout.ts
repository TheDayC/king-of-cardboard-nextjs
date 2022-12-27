import { createAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { HYDRATE } from 'next-redux-wrapper';

import { AppState } from '..';
import { Shipment } from '../../types/checkout';
import { AccountShippingMethod } from '../../types/shipping';
import { listShippingMethods } from '../../utils/account/shipping';
import { getPaymentMethods, getShipments } from '../../utils/checkout';
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

export const fetchShippingMethods = createAsyncThunk(
    'checkout/fetchShippingMethods',
    async (): Promise<AccountShippingMethod[]> => {
        const { shippingMethods } = await listShippingMethods(10, 0);
        return shippingMethods;
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
        setExistingBillingAddressId(state, action) {
            state.existingBillingAddressId = action.payload;
        },
        setExistingShippingAddressId(state, action) {
            state.existingShippingAddressId = action.payload;
        },
        setSameAsBilling(state, action) {
            state.isShippingSameAsBilling = action.payload;
        },
        setIsCheckoutLoading(state, action) {
            state.isCheckoutLoading = action.payload;
        },
        resetCheckoutDetails() {
            return checkoutInitialState;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(fetchPaymentMethods.fulfilled, (state, action) => {
            state.paymentMethods = action.payload;
        }),
            builder.addCase(fetchShippingMethods.fulfilled, (state, action) => {
                state.shippingMethods = action.payload;
                state.isCheckoutLoading = false;
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
    setExistingBillingAddressId,
    setExistingShippingAddressId,
    setSameAsBilling,
    resetCheckoutDetails,
    setIsCheckoutLoading,
} = checkoutSlice.actions;

export default checkoutSlice.reducer;
