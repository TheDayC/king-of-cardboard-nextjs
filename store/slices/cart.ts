import { createAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { get } from 'lodash';
import { HYDRATE } from 'next-redux-wrapper';

import { AppState } from '..';
import { CartItem, CartTotals, CreateOrder, FetchOrder } from '../../types/cart';
import { getCartItems, getCartTotals, getItemCount } from '../../utils/cart';
import { createOrder, getOrder } from '../../utils/commerce';
import { parseAsString, safelyParse } from '../../utils/parsers';
import cartInitialState from '../state/cart';
import { CommonThunkInput } from '../types/state';

interface CreateOrderInput {
    accessToken: string;
    isGuest: boolean;
}

interface FetchOrderInput {
    accessToken: string;
    orderId: string;
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

export const fetchOrder = createAsyncThunk(
    'cart/fetchOrder',
    async (data: FetchOrderInput): Promise<FetchOrder | null> => {
        const { accessToken, orderId } = data;

        return await getOrder(accessToken, orderId);
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
        setShouldCreateOrder(state, action) {
            state.shouldCreateOrder = action.payload;
        },
        setUpdatingCart(state, action) {
            state.isUpdatingCart = action.payload;
        },
        setShouldUpdateCart(state, action) {
            state.shouldUpdateCart = action.payload;
        },
        setOrderHasGiftCard(state, action) {
            state.orderHasGiftCard = action.payload;
        },
        setUpdateQuantities(state, action) {
            const { id } = action.payload;
            const newUpdateQtys = state.updateQuantities.filter((uQ) => uQ.id !== id);

            newUpdateQtys.push(action.payload);
            state.updateQuantities = newUpdateQtys;
        },
        clearUpdateQuantities(state) {
            state.updateQuantities = [];
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
                const {
                    shouldUpdateCart,
                    itemCount,
                    items,
                    isUpdatingCart,
                    subTotal,
                    shipping,
                    discount,
                    total,
                    orderHasGiftCard,
                    updateQuantities,
                } = cartInitialState;

                // Set new order id and number.
                state.orderId = orderId;
                state.orderNumber = orderNumber;
                state.shouldCreateOrder = false;

                // Reset remaining data.
                state.shouldUpdateCart = shouldUpdateCart;
                state.itemCount = itemCount;
                state.items = items;
                state.isUpdatingCart = isUpdatingCart;
                state.subTotal = subTotal;
                state.shipping = shipping;
                state.discount = discount;
                state.total = total;
                state.orderHasGiftCard = orderHasGiftCard;
                state.updateQuantities = updateQuantities;
            }),
            builder.addCase(fetchCartTotals.fulfilled, (state, action) => {
                const { subTotal, shipping, discount, total } = action.payload;

                state.subTotal = subTotal;
                state.shipping = shipping;
                state.discount = discount;
                state.total = total;
            }),
            builder.addCase(fetchCartItems.fulfilled, (state, action) => {
                state.items = action.payload;

                state.isUpdatingCart = false;
            }),
            builder.addCase(fetchOrder.fulfilled, (state, action) => {
                if (!action.payload) return;

                const { line_items, ...order } = action.payload;

                // Don't create a new order.
                state.shouldCreateOrder = false;

                // Set existing order id and number.
                state.orderId = order.id;
                state.orderNumber = order.number || null;

                // Reset remaining data.
                state.itemCount = get(order, 'line_items', []).length;
                state.items = line_items;
                state.subTotal = safelyParse(order, 'formatted_subtotal_amount', parseAsString, '£0.00');
                state.shipping = safelyParse(order, 'formatted_shipping_amount', parseAsString, '£0.00');
                state.discount = safelyParse(order, 'formatted_discount_amount', parseAsString, '£0.00');
                state.total = safelyParse(order, 'formatted_total_amount', parseAsString, '£0.00');
            }),
            builder.addCase(hydrate, (state, action) => ({
                ...state,
                ...action.payload[cartSlice.name],
            }));
    },
});

export const {
    resetCart,
    setUpdatingCart,
    setShouldCreateOrder,
    setShouldUpdateCart,
    setOrderHasGiftCard,
    setUpdateQuantities,
    clearUpdateQuantities,
} = cartSlice.actions;
export default cartSlice.reducer;
