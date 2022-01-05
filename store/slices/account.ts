import { createAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { HYDRATE } from 'next-redux-wrapper';

import { AppState } from '..';
import { GiftCard, Order, SingleOrder } from '../../types/account';
import { getGiftCard, getOrderPageCount, getOrders, getOrder } from '../../utils/account';
import accountInitialState from '../state/account';

const hydrate = createAction<AppState>(HYDRATE);

interface EmailThunkInput {
    accessToken: string;
    emailAddress: string;
}

interface OrdersThunkInput extends EmailThunkInput {
    pageSize: number;
    page: number;
}

interface OrderThunkInput {
    accessToken: string;
    orderNumber: string;
}

export const fetchGiftCard = createAsyncThunk(
    'account/fetchGiftCard',
    async (data: EmailThunkInput): Promise<GiftCard> => {
        const { accessToken, emailAddress } = data;

        return await getGiftCard(accessToken, emailAddress);
    }
);

export const fetchOrders = createAsyncThunk('account/fetchOrders', async (data: OrdersThunkInput): Promise<Order[]> => {
    const { accessToken, emailAddress, pageSize, page } = data;

    return await getOrders(accessToken, emailAddress, pageSize, page);
});

export const fetchCurrentOrder = createAsyncThunk(
    'account/fetchCurrentOrder',
    async (data: OrderThunkInput): Promise<SingleOrder> => {
        const { accessToken, orderNumber } = data;

        return await getOrder(accessToken, orderNumber);
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
            builder.addCase(fetchCurrentOrder.fulfilled, (state, action) => {
                state.currentOrder = action.payload;
            }),
            builder.addCase(hydrate, (state, action) => ({
                ...state,
                ...action.payload[accountSlice.name],
            }));
    },
});

export const { setSocialMedia, setBalance, setShouldFetchRewards } = accountSlice.actions;
export default accountSlice.reducer;
