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
                    stock: (state.items[productIndex].stock += 1),
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

            if (state.items[cartIndex] && state.items[cartIndex].stock < action.payload.stock) {
                state.items[cartIndex].stock += 1;
            }
        },
        decreaseAmount(state, action) {
            const cartIndex = state.items.findIndex((c) => c.id === action.payload);

            if (state.items[cartIndex] && state.items[cartIndex].stock > 1) {
                state.items[cartIndex].stock -= 1;
            }
        },
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
        resetCart() {
            return cartInitialState;
        },
    },
    extraReducers: (builder) => {
        builder.addDefaultCase((state) => state);
    },
});

export const {
    addItemToCart,
    removeItem,
    increaseAmount,
    decreaseAmount,
    setOrder,
    setLineItems,
    setPaymentMethods,
    fetchOrder,
    resetCart,
} = cartSlice.actions;
export default cartSlice.reducer;
