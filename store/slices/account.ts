import { createAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { HYDRATE } from 'next-redux-wrapper';

import { AppState } from '..';
import { Address, GetOrders, GiftCard, SingleAddress, SingleOrder } from '../../types/account';
import { SocialMedia } from '../../types/profile';
import {
    getGiftCard,
    getOrders,
    getOrder,
    getAddresses,
    getAddressPageCount,
    getCurrentAddress,
    getSocialMedia,
} from '../../utils/account';
import { parseAsNumber, safelyParse } from '../../utils/parsers';
import accountInitialState from '../state/account';

const hydrate = createAction<AppState>(HYDRATE);

interface EmailThunkInput {
    accessToken: string;
    emailAddress: string;
}

interface FetchOrdersThunkInput {
    accessToken: string;
    userToken: string;
    userId: string;
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

const URL = process.env.NEXT_PUBLIC_SITE_URL || '';

export const fetchCoins = createAsyncThunk('account/fetchCoins', async (userId: string): Promise<number> => {
    const res = await axios.get(`${URL}/api/account/coins/get`, { params: { userId } });

    return safelyParse(res, 'data.coins', parseAsNumber, 0);
});

export const fetchOrders = createAsyncThunk(
    'account/fetchOrders',
    async (data: FetchOrdersThunkInput): Promise<GetOrders> => {
        const { accessToken, userToken, userId, pageSize, page } = data;

        return await getOrders(accessToken, userToken, userId, pageSize, page);
    }
);

export const fetchCurrentOrder = createAsyncThunk(
    'account/fetchCurrentOrder',
    async (data: OrderThunkInput): Promise<SingleOrder> => {
        const { accessToken, orderNumber } = data;

        return await getOrder(accessToken, orderNumber);
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
    reducers: {
        setIsLoadingOrder(state, action) {
            state.isLoadingOrder = action.payload;
        },
        setIsLoadingOrders(state, action) {
            state.isLoadingOrders = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(fetchCoins.fulfilled, (state, action) => {
            state.coins = action.payload;
        }),
            builder.addCase(fetchOrders.fulfilled, (state, action) => {
                const { orders, count } = action.payload;

                state.orders = orders;
                state.orderPageCount = count;
                state.isLoadingOrders = false;
            }),
            builder.addCase(fetchCurrentOrder.fulfilled, (state, action) => {
                state.currentOrder = action.payload;
                state.isLoadingOrder = false;
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

export const { setIsLoadingOrder, setIsLoadingOrders } = accountSlice.actions;
export default accountSlice.reducer;
