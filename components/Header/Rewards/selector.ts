import { createSelector } from '@reduxjs/toolkit';

import { selectGlobalData, selectAccountData } from '../../../store/state/selectors';

const selector = createSelector([selectGlobalData, selectAccountData], (globalData, accountData) => ({
    accessToken: globalData.accessToken,
    shouldFetchRewards: accountData.shouldFetchRewards,
    balance: accountData.balance,
}));

export default selector;
