import { createAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { HYDRATE } from 'next-redux-wrapper';

import { AppState } from '..';
import { getItemCount } from '../../utils/cart';
import { createOrder } from '../../utils/commerce';
import cartInitialState from '../state/cart';

interface FetchItemCountInput {
    accessToken: string;
    orderId: string;
}

interface CreateOrderInput {
    accessToken: string;
    isGuest: boolean;
}

export const hydrate = createAction<AppState>(HYDRATE);

export const fetchItemCount = createAsyncThunk(
    'cart/fetchItemCount',
    async (data: FetchItemCountInput): Promise<number> => {
        const { accessToken, orderId } = data;

        return await getItemCount(accessToken, orderId);
    }
);

export const createCLOrder = createAsyncThunk(
    'cart/createCLOrder',
    async (data: CreateOrderInput): Promise<string | null> => {
        const { accessToken, isGuest } = data;

        return await createOrder(accessToken, isGuest);
    }
);

const cartSlice = createSlice({
    name: 'cart',
    initialState: cartInitialState,
    reducers: {
        setOrder(state, action) {
            state.order = action.payload;
        },
        setLineItems(state, action) {
            state.items = action.payload;
        },
        setPaymentMethods(state, action) {
            state.paymentMethods = action.payload;
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
    extraReducers: (builder) => {
        // Add reducers for additional action types here, and handle loading state as needed
        builder.addCase(fetchItemCount.fulfilled, (state, action) => {
            state.itemCount = action.payload;
        }),
            builder.addCase(createCLOrder.fulfilled, (state, action) => {
                state.orderId = action.payload;
            }),
            builder.addCase(hydrate, (state, action) => ({
                ...state,
                ...action.payload[cartSlice.name],
            }));
    },
});

export const { setOrder, setLineItems, setPaymentMethods, fetchOrder, resetCart, setUpdatingCart } = cartSlice.actions;
export default cartSlice.reducer;
