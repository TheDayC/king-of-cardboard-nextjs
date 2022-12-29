import { createAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { HYDRATE } from 'next-redux-wrapper';

import { AppState } from '..';
import { AccountAddress, GetOrders, Order, SingleAddress, SingleOrder } from '../../types/account';
import { SocialMedia } from '../../types/profile';
import { getOrders, getOrder, getCurrentAddress, getSocialMedia } from '../../utils/account';
import { parseAsAccountAddress, parseAsArrayOfAccountAddresses, parseAsNumber, safelyParse } from '../../utils/parsers';
import accountInitialState from '../state/account';

const hydrate = createAction<AppState>(HYDRATE);

interface EmailThunkInput {
    accessToken: string;
    emailAddress: string;
}

interface FetchOrdersThunkInput {
    userId: string;
    size: number;
    page: number;
}

interface OrderThunkInput {
    userId: string;
    orderNumber: number;
}

interface AddressThunkInput {
    accessToken: string;
    id: string;
}

interface ListAddressInput {
    userId: string;
    limit: number;
    skip: number;
}

interface ListAddressOutput {
    addresses: AccountAddress[];
    count: number;
}

const URL = process.env.NEXT_PUBLIC_SITE_URL || '';

export const fetchCoins = createAsyncThunk('account/fetchCoins', async (userId: string): Promise<number> => {
    const res = await axios.get(`${URL}/api/account/coins/get`, { params: { userId } });

    return safelyParse(res, 'data.coins', parseAsNumber, 0);
});

export const fetchOrders = createAsyncThunk(
    'account/fetchOrders',
    async (data: FetchOrdersThunkInput): Promise<GetOrders> => {
        const { userId, size, page } = data;

        const res = await axios.get(`${URL}/api/orders/list`, {
            params: {
                userId,
                size,
                page,
            },
        });

        return {
            orders: res.data.orders as Order[],
            count: safelyParse(res, 'data.count', parseAsNumber, 0),
        };
    }
);

export const fetchOrder = createAsyncThunk('account/fetchOrder', async (data: OrderThunkInput): Promise<Order> => {
    const { userId, orderNumber } = data;

    const res = await axios.get(`${URL}/api/orders/get`, {
        params: {
            userId,
            orderNumber,
        },
    });

    return res.data as Order;
});

export const addAddress = createAsyncThunk('account/addAddress', async (_id: string): Promise<boolean> => {
    const res = await axios.get(`${URL}/api/addresses/get`, { params: { _id } });
    const status = safelyParse(res, 'status', parseAsNumber, 400);

    return status === 201;
});

export const fetchAddresses = createAsyncThunk(
    'account/fetchAddresses',
    async (data: ListAddressInput): Promise<ListAddressOutput> => {
        const res = await axios.get(`${URL}/api/addresses/list`, { params: { ...data } });

        return {
            addresses: safelyParse(res, 'data.addresses', parseAsArrayOfAccountAddresses, [] as AccountAddress[]),
            count: safelyParse(res, 'data.count', parseAsNumber, 0),
        };
    }
);

export const deleteAddress = createAsyncThunk('account/deleteAddress', async (_id: string): Promise<string> => {
    await axios.delete(`${URL}/api/addresses/delete`, { params: { _id } });

    return _id;
});

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
        setIsLoadingAddressBook(state, action) {
            state.isLoadingAddressBook = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(fetchCoins.fulfilled, (state, action) => {
            state.coins = action.payload;
        }),
            builder.addCase(fetchOrders.fulfilled, (state, action) => {
                const { orders, count } = action.payload;

                state.orders = orders;
                state.orderCount = count;
                state.isLoadingOrders = false;
            }),
            builder.addCase(fetchOrder.fulfilled, (state, action) => {
                state.currentOrder = action.payload;
                state.isLoadingOrder = false;
            }),
            builder.addCase(fetchAddresses.fulfilled, (state, action) => {
                const { addresses, count } = action.payload;

                state.addresses = addresses;
                state.addressCount = count;
                state.isLoadingAddressBook = false;
            }),
            builder.addCase(deleteAddress.fulfilled, (state, action) => {
                state.addresses = state.addresses.filter(({ _id }) => _id !== action.payload);
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

export const { setIsLoadingOrder, setIsLoadingOrders, setIsLoadingAddressBook } = accountSlice.actions;
export default accountSlice.reducer;
