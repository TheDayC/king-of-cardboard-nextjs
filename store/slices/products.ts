import { createAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { HYDRATE } from 'next-redux-wrapper';

import { AppState } from '..';
import { ListProducts } from '../../types/products';
import { listProducts } from '../../utils/account/products';
import productsInitialState from '../state/products';
import { AppStateShape } from '../types/state';

const hydrate = createAction<AppState>(HYDRATE);

interface ProductsThunkInput {
    limit: number;
    skip: number;
}

export const fetchProducts = createAsyncThunk(
    'products/fetchProducts',
    async (data: ProductsThunkInput, { getState }): Promise<ListProducts> => {
        const { limit, skip } = data;
        const state = getState() as AppStateShape;
        const { categories, configurations, interests, stockStatus } = state.filters;

        return await listProducts(limit, skip, categories, configurations, interests, stockStatus);
    }
);

const productsSlice = createSlice({
    name: 'products',
    initialState: productsInitialState,
    reducers: {
        setProductsAndCount(state, action) {
            const { products, count } = action.payload;

            state.products = products;
            state.productsTotal = count;
            state.isLoadingProducts = false;
        },
        setIsLoadingProducts(state, action) {
            state.isLoadingProducts = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(fetchProducts.fulfilled, (state, action) => {
            const { products, count } = action.payload;

            state.products = products;
            state.productsTotal = count;
            state.isLoadingProducts = false;
        }),
            builder.addCase(hydrate, (state, action) => ({
                ...state,
                ...action.payload[productsSlice.name],
            }));
    },
});

export const { setIsLoadingProducts, setProductsAndCount } = productsSlice.actions;

export default productsSlice.reducer;
