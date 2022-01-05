import { AccountState } from '../types/state';

const accountInitialState: AccountState = {
    socialMedia: {
        instagram: '',
        twitter: '',
        twitch: '',
        youtube: '',
        ebay: '',
    },
    balance: 0,
    shouldFetchRewards: true,
    giftCard: {
        id: '',
        status: '',
        balance: 0,
        reference: '',
        recipient_email: '',
        code: '',
    },
    orders: [],
    orderPageCount: 0,
};

export default accountInitialState;
