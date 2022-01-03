import { createAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { HYDRATE } from 'next-redux-wrapper';

import { AppState } from '..';
import { CartItem, CartTotals, CreateOrder } from '../../types/cart';
import { getCartItems, getCartTotals, getItemCount } from '../../utils/cart';
import { createOrder } from '../../utils/commerce';
import cartInitialState from '../state/cart';
import { CommonThunkInput } from '../types/state';

interface CreateOrderInput {
    accessToken: string;
    isGuest: boolean;
}

const hydrate = createAction<AppState>(HYDRATE);

export const fetchItemCount = createAsyncThunk(
    'cart/fetchItemCount',
    async (data: CommonThunkInput): Promise<number> => {
        const { accessToken, orderId } = data;

        return await getItemCount(accessToken, orderId);
    }
);

export const createCLOrder = createAsyncThunk(
    'cart/createCLOrder',
    async (data: CreateOrderInput): Promise<CreateOrder> => {
        const { accessToken, isGuest } = data;

        return await createOrder(accessToken, isGuest);
    }
);

export const fetchCartTotals = createAsyncThunk(
    'cart/fetchCartTotals',
    async (data: CommonThunkInput): Promise<CartTotals> => {
        const { accessToken, orderId } = data;

        return await getCartTotals(accessToken, orderId);
    }
);

export const fetchCartItems = createAsyncThunk(
    'cart/fetchCartItems',
    async (data: CommonThunkInput): Promise<CartItem[]> => {
        const { accessToken, orderId } = data;

        return await getCartItems(accessToken, orderId);
    }
);

const cartSlice = createSlice({
    name: 'cart',
    initialState: cartInitialState,
    reducers: {
        setLineItems(state, action) {
            state.items = action.payload;
        },
        fetchOrder(state, action) {
            state.shouldFetchOrder = action.payload;
        },
        setShouldCreateOrder(state, action) {
            state.shouldCreateOrder = action.payload;
        },
        setUpdatingCart(state, action) {
            state.isUpdatingCart = action.payload;
        },
        setShouldUpdateCart(state, action) {
            state.shouldUpdateCart = action.payload;
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
                const { orderId, orderNumber } = action.payload;

                state.orderId = orderId;
                state.orderNumber = orderNumber;
                state.shouldCreateOrder = false;
            }),
            builder.addCase(fetchCartTotals.fulfilled, (state, action) => {
                const { subTotal, shipping, total } = action.payload;

                state.subTotal = subTotal;
                state.shipping = shipping;
                state.total = total;
            }),
            builder.addCase(fetchCartItems.fulfilled, (state, action) => {
                state.items = action.payload;
            }),
            builder.addCase(hydrate, (state, action) => ({
                ...state,
                ...action.payload[cartSlice.name],
            }));
    },
});

export const { setLineItems, fetchOrder, resetCart, setUpdatingCart, setShouldCreateOrder, setShouldUpdateCart } =
    cartSlice.actions;
export default cartSlice.reducer;
