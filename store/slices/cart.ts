import { createAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { HYDRATE } from 'next-redux-wrapper';
import { PURGE } from 'redux-persist';

import { AppState } from '..';
import { CreateOrder, FetchOrder, Totals } from '../../types/cart';
import { createOrder } from '../../utils/commerce';
import { parseAsNumber, safelyParse } from '../../utils/parsers';
import cartInitialState from '../state/cart';
import { AppStateShape } from '../types/state';

const URL = process.env.NEXT_PUBLIC_SITE_URL || '';

interface CreateOrderInput {
    accessToken: string;
    isGuest: boolean;
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

export const fetchCartTotals = createAsyncThunk(
    'cart/fetchCartTotals',
    async (undefined, { getState }): Promise<Totals> => {
        const { account, cart, checkout } = getState() as AppStateShape;
        const shallowItems = cart.items.map(({ _id: id, quantity }) => ({ id, quantity }));

        const data = {
            items: shallowItems,
            coins: cart.shouldUseCoins ? account.coins : 0,
            shippingMethodId: checkout.chosenShippingMethodId,
        };

        const res = await axios.post(`${URL}/api/cart/calculateTotals`, data);

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
        setUpdatingCart(state, action) {
            state.isUpdatingCart = action.payload;
        },
        addItem(state, action) {
            const { _id, quantity } = action.payload;
            const existingItem = state.items.find((i) => i._id === _id);

            if (existingItem) {
                const newItems = state.items.filter((i) => i._id !== _id);
                const newQty = existingItem.quantity + quantity;

                state.items = [...newItems, { ...existingItem, quantity: newQty }];
            } else {
                state.items.push(action.payload);
            }
        },
        removeItem(state, action) {
            state.items = state.items.filter((item) => item._id !== action.payload);
        },
        updateCartQty(state, action) {
            const { id, quantity } = action.payload;
            const item = state.items.find((i) => i._id === id);
            const newItems = state.items.filter((i) => i._id !== id);

            if (item) {
                state.items = [...newItems, { ...item, cartQty: quantity }];
            }
        },
        updateItemQty(state) {
            const items = state.items;

            state.items = items.map((item) => ({ ...item, quantity: item.cartQty || item.quantity }));
        },
        setShouldUseCoins(state, action) {
            state.shouldUseCoins = action.payload;
        },
        resetCart() {
            return cartInitialState;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(fetchCartTotals.fulfilled, (state, action) => {
            const { subTotal, shipping, discount, total } = action.payload;

            state.subTotal = subTotal;
            state.shipping = shipping;
            state.discount = discount;
            state.total = total;
            state.isUpdatingCart = false;
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

export const { resetCart, setUpdatingCart, addItem, removeItem, updateCartQty, updateItemQty, setShouldUseCoins } =
    cartSlice.actions;
export default cartSlice.reducer;
