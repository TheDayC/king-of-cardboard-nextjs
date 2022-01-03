import { createAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { HYDRATE } from 'next-redux-wrapper';

import { AppState } from '..';
import { SingleProduct } from '../../types/products';
import { getSingleProduct } from '../../utils/products';
import productsInitialState from '../state/products';

const hydrate = createAction<AppState>(HYDRATE);

interface SingleProductThunkInput {
    accessToken: string;
    slug: string;
}

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
        // Add reducers for additional action types here, and handle loading state as needed
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
