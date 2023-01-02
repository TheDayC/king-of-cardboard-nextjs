import { createAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { HYDRATE } from 'next-redux-wrapper';

import { AppState } from '..';
import { AccountShippingMethod } from '../../types/shipping';
import { listShippingMethods } from '../../utils/account/shipping';
import checkoutInitialState from '../state/checkout';

const hydrate = createAction<AppState>(HYDRATE);

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
            state.isCheckoutLoading = false;
        },
        setExistingShippingAddressId(state, action) {
            state.existingShippingAddressId = action.payload;
            state.isCheckoutLoading = false;
        },
        setSameAsBilling(state, action) {
            state.isShippingSameAsBilling = action.payload;
        },
        setIsCheckoutLoading(state, action) {
            state.isCheckoutLoading = action.payload;
        },
        setChosenShippingMethodId(state, action) {
            state.chosenShippingMethodId = action.payload;
            state.isCheckoutLoading = false;
        },
        resetCheckoutDetails() {
            return checkoutInitialState;
        },
    },
    extraReducers: (builder) => {
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
    setChosenShippingMethodId,
} = checkoutSlice.actions;

export default checkoutSlice.reducer;
