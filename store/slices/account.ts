import { createAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { HYDRATE } from 'next-redux-wrapper';

import { AppState } from '..';
import { Address, GiftCard, Order, SingleAddress, SingleOrder } from '../../types/account';
import { SocialMedia } from '../../types/profile';
import {
    getGiftCard,
    getOrderPageCount,
    getOrders,
    getOrder,
    getAddresses,
    getAddressPageCount,
    getCurrentAddress,
    getSocialMedia,
} from '../../utils/account';
import accountInitialState from '../state/account';

const hydrate = createAction<AppState>(HYDRATE);

interface EmailThunkInput {
    accessToken: string;
    emailAddress: string;
}

interface PaginatedThunkInput {
    accessToken: string;
    pageSize: number;
    page: number;
}

interface OrderThunkInput {
    accessToken: string;
    orderNumber: string;
}

interface AddressThunkInput {
    accessToken: string;
    id: string;
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
    async (data: PaginatedThunkInput): Promise<Order[]> => {
        const { accessToken, pageSize, page } = data;

        return await getOrders(accessToken, pageSize, page);
    }
);

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

export const fetchAddresses = createAsyncThunk(
    'account/fetchAddresses',
    async (accessToken: string): Promise<Address[]> => {
        return await getAddresses(accessToken);
    }
);

export const fetchAddressPageCount = createAsyncThunk(
    'account/fetchAddressPageCount',
    async (accessToken: string): Promise<number> => {
        return await getAddressPageCount(accessToken);
    }
);

export const fetchCurrentAddress = createAsyncThunk(
    'account/fetchCurrentAddress',
    async (data: AddressThunkInput): Promise<SingleAddress> => {
        const { accessToken, id } = data;

        return await getCurrentAddress(accessToken, id);
    }
);

export const fetchSocialMedia = createAsyncThunk(
    'account/fetchSocialMedia',
    async (emailAddress: string): Promise<SocialMedia> => {
        return await getSocialMedia(emailAddress);
    }
);

const accountSlice = createSlice({
    name: 'account',
    initialState: accountInitialState,
    reducers: {},
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
            builder.addCase(fetchAddresses.fulfilled, (state, action) => {
                state.addresses = action.payload;
            }),
            builder.addCase(fetchAddressPageCount.fulfilled, (state, action) => {
                state.addressPageCount = action.payload;
            }),
            builder.addCase(fetchCurrentAddress.fulfilled, (state, action) => {
                state.currentAddress = action.payload;
            }),
            builder.addCase(fetchSocialMedia.fulfilled, (state, action) => {
                state.socialMedia = action.payload;
            }),
            builder.addCase(hydrate, (state, action) => ({
                ...state,
                ...action.payload[accountSlice.name],
            }));
    },
});

//export const {} = accountSlice.actions;
export default accountSlice.reducer;
