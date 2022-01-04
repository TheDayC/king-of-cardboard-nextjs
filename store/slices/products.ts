import { createAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { HYDRATE } from 'next-redux-wrapper';

import { AppState } from '..';
import { Categories, ProductType } from '../../enums/shop';
import { Product, SingleProduct } from '../../types/products';
import { getProducts, getProductsTotal, getSingleProduct } from '../../utils/products';
import productsInitialState from '../state/products';

const hydrate = createAction<AppState>(HYDRATE);

interface ProductsThunkInput {
    accessToken: string;
    limit: number;
    skip: number;
    categories: Categories[];
    productTypes: ProductType[];
}

interface SingleProductThunkInput {
    accessToken: string;
    slug: string;
}

export const fetchProducts = createAsyncThunk(
    'products/fetchProducts',
    async (data: ProductsThunkInput): Promise<Product[]> => {
        const { accessToken, limit, skip, categories, productTypes } = data;

        return await getProducts(accessToken, limit, skip, categories, productTypes);
    }
);

export const fetchProductsTotal = createAsyncThunk(
    'products/fetchProductsTotal',
    async (): Promise<number> => await getProductsTotal()
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
        addSkuItems(state, action) {
            return action.payload;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(fetchProducts.fulfilled, (state, action) => {
            state.products = action.payload;
        }),
            builder.addCase(fetchProductsTotal.fulfilled, (state, action) => {
                state.productsTotal = action.payload;
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

export const { addSkuItems } = productsSlice.actions;
export default productsSlice.reducer;
