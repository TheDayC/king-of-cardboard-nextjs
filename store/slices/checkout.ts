import { createSlice } from '@reduxjs/toolkit';

import checkoutInitialState from '../state/checkout';

const checkoutSlice = createSlice({
    name: 'checkout',
    initialState: checkoutInitialState,
    reducers: {
        incrementStep(state) {
            if (state.currentStep < 3) {
                state.currentStep += 1;
            }
        },
        decrementStep(state) {
            if (state.currentStep > 1) {
                state.currentStep -= 1;
            }
        },
        setStep(state, action) {
            state.currentStep = action.payload;
        },
        setTotals(state, action) {
            const { subTotal, taxes, total } = action.payload;

            state.subTotal = subTotal;
            state.taxes = taxes;
            state.total = total;
        },
        setSubTotal(state, action) {
            state.subTotal = action.payload;
        },
        setTaxes(state, action) {
            state.taxes = action.payload;
        },
        setTotal(state, action) {
            state.total = action.payload;
        },
        setEmail(state, action) {
            state.customerDetails.email = action.payload;
        },
        setFirstName(state, action) {
            state.customerDetails.firstName = action.payload;
        },
        setLastName(state, action) {
            state.customerDetails.lastName = action.payload;
        },
        setAddressLineOne(state, action) {
            state.customerDetails.addressLineOne = action.payload;
        },
        setAddressLineTwo(state, action) {
            state.customerDetails.addressLineTwo = action.payload;
        },
        setCity(state, action) {
            state.customerDetails.city = action.payload;
        },
        setPostCode(state, action) {
            state.customerDetails.postcode = action.payload;
        },
        setCounty(state, action) {
            state.customerDetails.county = action.payload;
        },
        setPhone(state, action) {
            state.customerDetails.phone = action.payload;
        },
        setAllowShippingAddress(state, action) {
            state.customerDetails.allowShippingAddress = action.payload;
        },
        setShippingAddressLineOne(state, action) {
            state.customerDetails.shippingAddressLineOne = action.payload;
        },
        setShippingAddressLineTwo(state, action) {
            state.customerDetails.shippingAddressLineTwo = action.payload;
        },
        setShippingCity(state, action) {
            state.customerDetails.shippingCity = action.payload;
        },
        setShippingPostcode(state, action) {
            state.customerDetails.shippingPostcode = action.payload;
        },
        setShippingCounty(state, action) {
            state.customerDetails.shippingCounty = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder.addDefaultCase((state) => state);
    },
});

export const {
    incrementStep,
    decrementStep,
    setStep,
    setTotals,
    setSubTotal,
    setTaxes,
    setTotal,
    setEmail,
    setFirstName,
    setLastName,
    setAddressLineOne,
    setAddressLineTwo,
    setCity,
    setPostCode,
    setCounty,
    setPhone,
    setAllowShippingAddress,
    setShippingAddressLineOne,
    setShippingAddressLineTwo,
    setShippingCity,
    setShippingPostcode,
    setShippingCounty,
} = checkoutSlice.actions;
export default checkoutSlice.reducer;
