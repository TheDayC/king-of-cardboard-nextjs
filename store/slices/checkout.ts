import { createSlice } from '@reduxjs/toolkit';

import checkoutInitialState from '../state/checkout';

const checkoutSlice = createSlice({
    name: 'checkout',
    initialState: checkoutInitialState,
    reducers: {
        setCurrentStep(state, action) {
            state.currentStep = action.payload;
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
        setCompany(state, action) {
            state.customerDetails.company = action.payload;
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
        setShippingMethod(state, action) {
            state.shippingMethod = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder.addDefaultCase((state) => state);
    },
});

export const {
    setCurrentStep,
    setEmail,
    setFirstName,
    setLastName,
    setCompany,
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
    setShippingMethod,
} = checkoutSlice.actions;

export default checkoutSlice.reducer;
