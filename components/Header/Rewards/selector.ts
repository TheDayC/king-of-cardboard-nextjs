import { createSelector } from '@reduxjs/toolkit';

import { selectGlobalData, selectAccountData } from '../../../store/state/selectors';

const selector = createSelector([selectGlobalData, selectAccountData], (globalData, accountData) => ({
    accessToken: globalData.accessToken,
    balance: accountData.giftCard.balance,
}));

export default selector;
