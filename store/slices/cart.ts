import { createSlice } from '@reduxjs/toolkit';

import cartInitialState from '../state/cart';

const cartSlice = createSlice({
    name: 'cart',
    initialState: cartInitialState,
    reducers: {
        addItemToCart(state, action) {
            const productIndex = state.findIndex((s) => s.id === action.payload.id);

            if (productIndex >= 0) {
                const newProduct = {
                    ...state[productIndex],
                    amount: (state[productIndex].amount += 1),
                };

                state[productIndex] = newProduct;
            } else {
                state.push(action.payload);
            }
        },
        removeItem(state, action) {
            const cartIndex = state.findIndex((c) => c.id === action.payload);

            if (state[cartIndex]) {
                state.splice(cartIndex, 1);
            }
        },
        increaseAmount(state, action) {
            const cartIndex = state.findIndex((c) => c.id === action.payload.id);

            if (state[cartIndex] && state[cartIndex].amount < action.payload.stock) {
                state[cartIndex].amount += 1;
            }
        },
        decreaseAmount(state, action) {
            const cartIndex = state.findIndex((c) => c.id === action.payload);

            if (state[cartIndex] && state[cartIndex].amount > 1) {
                state[cartIndex].amount -= 1;
            }
        },
    },
    extraReducers: (builder) => {
        builder.addDefaultCase((state) => state);
    },
});

export const { addItemToCart, removeItem, increaseAmount, decreaseAmount } = cartSlice.actions;
export default cartSlice.reducer;
