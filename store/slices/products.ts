import { createAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { HYDRATE } from 'next-redux-wrapper';

import { AppState } from '..';
import { Interest, SortOption } from '../../enums/products';
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
        const { categories, configurations, interests, stockStatus, searchTerm, sortOption } = state.filters;

        return await listProducts(
            limit,
            skip,
            false,
            categories,
            configurations,
            interests,
            stockStatus,
            searchTerm,
            sortOption
        );
    }
);

export const fetchProductRows = createAsyncThunk(
    'products/fetchProductRows',
    async (data: ProductsThunkInput, { getState }): Promise<ListProducts> => {
        const { limit, skip } = data;
        const state = getState() as AppStateShape;
        const { categories, configurations, stockStatus, searchTerm, sortOption } = state.filters;

        const { products: baseballProducts, count: baseballCount } = await listProducts(
            limit,
            skip,
            true,
            categories,
            configurations,
            [Interest.Baseball],
            stockStatus,
            searchTerm,
            sortOption
        );
        const { products: basketballProducts, count: basketballCount } = await listProducts(
            limit,
            skip,
            true,
            categories,
            configurations,
            [Interest.Basketball],
            stockStatus,
            searchTerm,
            sortOption
        );
        const { products: footballProducts, count: footballCount } = await listProducts(
            limit,
            skip,
            true,
            categories,
            configurations,
            [Interest.Football],
            stockStatus,
            searchTerm,
            sortOption
        );
        const { products: soccerProducts, count: soccerCount } = await listProducts(
            limit,
            skip,
            true,
            categories,
            configurations,
            [Interest.Soccer],
            stockStatus,
            searchTerm,
            sortOption
        );
        const { products: ufcProducts, count: ufcCount } = await listProducts(
            limit,
            skip,
            true,
            categories,
            configurations,
            [Interest.UFC],
            stockStatus,
            searchTerm,
            sortOption
        );
        const { products: wweProducts, count: wweCount } = await listProducts(
            limit,
            skip,
            true,
            categories,
            configurations,
            [Interest.Wrestling],
            stockStatus,
            searchTerm,
            sortOption
        );
        const { products: pokemonProducts, count: pokemonCount } = await listProducts(
            limit,
            skip,
            true,
            categories,
            configurations,
            [Interest.Pokemon],
            stockStatus,
            searchTerm,
            sortOption
        );

        return {
            products: [
                ...baseballProducts,
                ...basketballProducts,
                ...footballProducts,
                ...soccerProducts,
                ...ufcProducts,
                ...wweProducts,
                ...pokemonProducts,
            ],
            count:
                baseballProducts.length +
                basketballProducts.length +
                footballProducts.length +
                soccerProducts.length +
                ufcProducts.length +
                wweProducts.length +
                pokemonProducts.length,
        };
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
            builder.addCase(fetchProductRows.fulfilled, (state, action) => {
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
