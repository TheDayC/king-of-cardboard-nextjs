import { createSlice } from '@reduxjs/toolkit';
import { HYDRATE } from 'next-redux-wrapper';

import cartInitialState from '../state/cart';

const cartSlice = createSlice({
    name: 'cart',
    initialState: cartInitialState,
    reducers: {
        setOrder(state, action) {
            return {
                ...state,
                order: action.payload,
            };
        },
        setLineItems(state, action) {
            return {
                ...state,
                items: action.payload,
            };
        },
        setPaymentMethods(state, action) {
            return {
                ...state,
                paymentMethods: action.payload,
            };
        },
        fetchOrder(state, action) {
            state.shouldFetchOrder = action.payload;
        },
        setUpdatingCart(state, action) {
            state.isUpdatingCart = action.payload;
        },
        resetCart() {
            return cartInitialState;
        },
    },
    extraReducers: {
        [HYDRATE]: (state, action) => {
            console.log('HYDRATE', state, action.payload);
            return {
                ...state,
                ...action.payload.subject,
            };
        },
    },
});

export const { setOrder, setLineItems, setPaymentMethods, fetchOrder, resetCart, setUpdatingCart } = cartSlice.actions;
export default cartSlice.reducer;
