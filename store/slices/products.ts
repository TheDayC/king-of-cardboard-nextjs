import { createAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { HYDRATE } from 'next-redux-wrapper';

import { AppState } from '..';
import { Categories, ProductType } from '../../enums/shop';
import { ProductsWithCount, SingleProduct } from '../../types/products';
import { ListProducts } from '../../types/productsNew';
import { listProducts } from '../../utils/account/products';
import { getProducts, getSingleProduct } from '../../utils/products';
import productsInitialState from '../state/products';
import { AppStateShape } from '../types/state';

const hydrate = createAction<AppState>(HYDRATE);

interface ProductsThunkInput {
    limit: number;
    skip: number;
}

interface SingleProductThunkInput {
    accessToken: string;
    slug: string;
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

export const fetchSingleProduct = createAsyncThunk(
    'products/fetchSingleProduct',
    async (data: SingleProductThunkInput): Promise<SingleProduct> => {
        const { accessToken, slug } = data;

        return await getSingleProduct(accessToken, slug);
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
        clearCurrentProduct(state) {
            state.currentProduct = {
                id: '',
                name: '',
                slug: '',
                sku_code: '',
                description: null,
                types: [],
                categories: [],
                images: {
                    items: [],
                },
                cardImage: {
                    title: '',
                    description: '',
                    url: '',
                },
                tags: [],
                amount: '',
                compare_amount: '',
                inventory: {
                    available: false,
                    quantity: 0,
                    levels: [],
                },
                skuOptions: [],
            };
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
            builder.addCase(fetchSingleProduct.fulfilled, (state, action) => {
                state.currentProduct = action.payload;
            }),
            builder.addCase(hydrate, (state, action) => ({
                ...state,
                ...action.payload[productsSlice.name],
            }));
    },
});

export const { clearCurrentProduct, setIsLoadingProducts, setProductsAndCount } = productsSlice.actions;

export default productsSlice.reducer;
