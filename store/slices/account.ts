import { createAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { HYDRATE } from 'next-redux-wrapper';

import { AppState } from '..';
import { GiftCard, Order } from '../../types/account';
import { getGiftCard, getOrderPageCount, getOrders } from '../../utils/account';
import accountInitialState from '../state/account';

const hydrate = createAction<AppState>(HYDRATE);

interface EmailThunkInput {
    accessToken: string;
    emailAddress: string;
}

interface ProductsThunkInput extends EmailThunkInput {
    pageSize: number;
    page: number;
}

export const fetchGiftCard = createAsyncThunk(
    'account/fetchGiftCard',
    async (data: EmailThunkInput): Promise<GiftCard> => {
        const { accessToken, emailAddress } = data;

        return await getGiftCard(accessToken, emailAddress);
    }
);

export const fetchOrders = createAsyncThunk(
    'account/fetchOrders',
    async (data: ProductsThunkInput): Promise<Order[]> => {
        const { accessToken, emailAddress, pageSize, page } = data;

        return await getOrders(accessToken, emailAddress, pageSize, page);
    }
);

export const fetchOrderPageCount = createAsyncThunk(
    'account/fetchOrderPageCount',
    async (data: EmailThunkInput): Promise<number> => {
        const { accessToken, emailAddress } = data;

        return await getOrderPageCount(accessToken, emailAddress);
    }
);

const accountSlice = createSlice({
    name: 'account',
    initialState: accountInitialState,
    reducers: {
        setSocialMedia(state, action) {
            state.socialMedia = action.payload;
        },
        setBalance(state, action) {
            state.balance = action.payload;
        },
        setShouldFetchRewards(state, action) {
            state.shouldFetchRewards = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(fetchGiftCard.fulfilled, (state, action) => {
            state.giftCard = action.payload;
        }),
            builder.addCase(fetchOrders.fulfilled, (state, action) => {
                state.orders = action.payload;
            }),
            builder.addCase(fetchOrderPageCount.fulfilled, (state, action) => {
                state.orderPageCount = action.payload;
            }),
            builder.addCase(hydrate, (state, action) => ({
                ...state,
                ...action.payload[accountSlice.name],
            }));
    },
});

export const { setSocialMedia, setBalance, setShouldFetchRewards } = accountSlice.actions;
export default accountSlice.reducer;
