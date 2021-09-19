import { createSlice } from '@reduxjs/toolkit';

import cartInitialState from '../state/cart';

const cartSlice = createSlice({
    name: 'cart',
    initialState: cartInitialState,
    reducers: {
        addItemToCart(state, action) {
            const productIndex = state.items.findIndex((s) => s.id === action.payload.id);

            if (productIndex >= 0) {
                const newProduct = {
                    ...state.items[productIndex],
                    amount: (state.items[productIndex].amount += 1),
                };

                state.items[productIndex] = newProduct;
            } else {
                state.items.push(action.payload);
            }
        },
        removeItem(state, action) {
            const cartIndex = state.items.findIndex((c) => c.id === action.payload);

            if (state.items[cartIndex]) {
                state.items.splice(cartIndex, 1);
            }
        },
        increaseAmount(state, action) {
            const cartIndex = state.items.findIndex((c) => c.id === action.payload.id);

            if (state.items[cartIndex] && state.items[cartIndex].amount < action.payload.stock) {
                state.items[cartIndex].amount += 1;
            }
        },
        decreaseAmount(state, action) {
            const cartIndex = state.items.findIndex((c) => c.id === action.payload);

            if (state.items[cartIndex] && state.items[cartIndex].amount > 1) {
                state.items[cartIndex].amount -= 1;
            }
        },
        createOrder(state, action) {
            state.order = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder.addDefaultCase((state) => state);
    },
});

export const { addItemToCart, removeItem, increaseAmount, decreaseAmount, createOrder } = cartSlice.actions;
export default cartSlice.reducer;
