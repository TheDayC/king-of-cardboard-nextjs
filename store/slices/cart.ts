import { createAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { HYDRATE } from 'next-redux-wrapper';
import { PURGE } from 'redux-persist';

import { AppState } from '..';
import { CreateOrder, FetchCartTotals, FetchOrder, Totals } from '../../types/cart';
import { createOrder, getOrder } from '../../utils/commerce';
import { parseAsNumber, safelyParse } from '../../utils/parsers';
import cartInitialState from '../state/cart';

const URL = process.env.NEXT_PUBLIC_SITE_URL || '';

interface CreateOrderInput {
    accessToken: string;
    isGuest: boolean;
}

interface FetchOrderInput {
    accessToken: string;
    orderId: string;
}

const hydrate = createAction<AppState>(HYDRATE);
const purge = createAction<AppState>(PURGE);

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
    async (data: FetchCartTotals[]): Promise<Totals> => {
        const res = await axios.post(`${URL}/api/cart/calculateTotals`, { items: data });

        return {
            subTotal: safelyParse(res, 'data.subTotal', parseAsNumber, 0),
            shipping: safelyParse(res, 'data.shipping', parseAsNumber, 0),
            discount: safelyParse(res, 'data.discount', parseAsNumber, 0),
            total: safelyParse(res, 'data.total', parseAsNumber, 0),
        };
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
        setOrderId(state, action) {
            state.orderId = action.payload;
        },
        setOrderExpiry(state, action) {
            state.orderExpiry = action.payload;
        },
        addItem(state, action) {
            state.items.push(action.payload);
        },
        removeItem(state, action) {
            state.items = state.items.filter((item) => item._id !== action.payload);
        },
        addToSubtotal(state, action) {
            state.subTotal += action.payload;
        },
        addToTotal(state, action) {
            state.total += action.payload;
        },
        subtractFromSubtotal(state, action) {
            state.subTotal -= action.payload;
        },
        subtractFromTotal(state, action) {
            state.total -= action.payload;
        },
        updateItemQty(state, action) {
            const { id, quantity } = action.payload;
            const item = state.items.find((i) => i._id === id);
            const newItems = state.items.filter((i) => i._id !== id);

            if (item) {
                state.items = [...newItems, { ...item, quantity }];
            }
        },
        resetCart() {
            return cartInitialState;
        },
        setOrder(state, action) {
            const { orderId, orderNumber, expiry } = action.payload;
            const {
                shouldUpdateCart,
                items,
                isUpdatingCart,
                subTotal,
                shipping,
                discount,
                total,
                orderHasGiftCard,
                updateQuantities,
            } = cartInitialState;

            // Set new order id, number expiry.
            state.orderId = orderId;
            state.orderNumber = orderNumber;
            state.orderExpiry = expiry;
            state.shouldCreateOrder = false;

            // Reset remaining data.
            state.shouldUpdateCart = shouldUpdateCart;
            state.items = items;
            state.isUpdatingCart = isUpdatingCart;
            state.subTotal = subTotal;
            state.shipping = shipping;
            state.discount = discount;
            state.total = total;
            state.orderHasGiftCard = orderHasGiftCard;
            state.updateQuantities = updateQuantities;
        },
    },
    extraReducers: (builder) => {
        // Add reducers for additional action types here, and handle loading state as needed
        builder.addCase(createCLOrder.fulfilled, (state, action) => {
            const { orderId, orderNumber, expiry } = action.payload;
            const {
                shouldUpdateCart,
                items,
                isUpdatingCart,
                subTotal,
                shipping,
                discount,
                total,
                orderHasGiftCard,
                updateQuantities,
            } = cartInitialState;

            // Set new order id, number expiry.
            state.orderId = orderId;
            state.orderNumber = orderNumber;
            state.orderExpiry = expiry;
            state.shouldCreateOrder = false;

            // Reset remaining data.
            state.shouldUpdateCart = shouldUpdateCart;
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
                state.items = line_items;
                /* state.subTotal = safelyParse(order, 'formatted_subtotal_amount', parseAsString, '£0.00');
                state.shipping = safelyParse(order, 'formatted_shipping_amount', parseAsString, '£0.00');
                state.discount = safelyParse(order, 'formatted_discount_amount', parseAsString, '£0.00');
                state.total = safelyParse(order, 'formatted_total_amount', parseAsString, '£0.00'); */
            }),
            builder.addCase(hydrate, (state, action) => ({
                ...state,
                ...action.payload[cartSlice.name],
            })),
            builder.addCase(purge, () => {
                return cartInitialState;
            });
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
    setOrderExpiry,
    setOrderId,
    setOrder,
    addItem,
    removeItem,
    addToSubtotal,
    addToTotal,
    subtractFromSubtotal,
    subtractFromTotal,
    updateItemQty,
} = cartSlice.actions;
export default cartSlice.reducer;
