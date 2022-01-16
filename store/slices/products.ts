import { createAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { HYDRATE } from 'next-redux-wrapper';

import { AppState } from '..';
import { Categories, ProductType } from '../../enums/shop';
import { ProductsWithCount, SingleProduct } from '../../types/products';
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
    async (data: ProductsThunkInput): Promise<ProductsWithCount> => {
        const { accessToken, limit, skip, categories, productTypes } = data;

        return await getProducts(accessToken, limit, skip, categories, productTypes);
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
        clearCurrentProduct(state) {
            state.currentProduct = {
                id: '',
                name: '',
                slug: '',
                sku_code: '',
                description: '',
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
            };
        },
    },
    extraReducers: (builder) => {
        builder.addCase(fetchProducts.fulfilled, (state, action) => {
            const { products, count } = action.payload;
            state.products = products;
            state.productsTotal = count;
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

export const { clearCurrentProduct } = productsSlice.actions;

export default productsSlice.reducer;
