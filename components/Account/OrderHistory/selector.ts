import { createSelector } from '@reduxjs/toolkit';

import { selectGlobalData, selectAccountData } from '../../../store/state/selectors';

const selector = createSelector([selectGlobalData, selectAccountData], (global, account) => ({
    accessToken: global.userToken || global.accessToken,
    userId: global.userId,
    orders: account.orders,
    orderPageCount: account.orderPageCount,
}));

export default selector;
