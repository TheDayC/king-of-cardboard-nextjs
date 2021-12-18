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
};

export default accountInitialState;
