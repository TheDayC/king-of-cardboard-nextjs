import { createAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { HYDRATE } from 'next-redux-wrapper';

import { AppState } from '..';
import { GiftCard } from '../../types/account';
import { getGiftCard } from '../../utils/account';
import accountInitialState from '../state/account';

const hydrate = createAction<AppState>(HYDRATE);

interface FetchGiftCardIdInput {
    accessToken: string;
    emailAddress: string;
}

export const fetchGiftCard = createAsyncThunk(
    'account/fetchGiftCard',
    async (data: FetchGiftCardIdInput): Promise<GiftCard> => {
        const { accessToken, emailAddress } = data;

        return await getGiftCard(accessToken, emailAddress);
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
        // Add reducers for additional action types here, and handle loading state as needed
        builder.addCase(fetchGiftCard.fulfilled, (state, action) => {
            state.giftCard = action.payload;
        }),
            builder.addCase(hydrate, (state, action) => ({
                ...state,
                ...action.payload[accountSlice.name],
            }));
    },
});

export const { setSocialMedia, setBalance, setShouldFetchRewards } = accountSlice.actions;
export default accountSlice.reducer;
