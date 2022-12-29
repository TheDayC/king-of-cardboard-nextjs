import { createSelector } from '@reduxjs/toolkit';

import { selectGlobalData, selectAccountData } from '../../../store/state/selectors';

const selector = createSelector([selectGlobalData, selectAccountData], (global, account) => ({
    orders: account.orders,
    orderCount: account.orderCount,
    isLoadingOrders: account.isLoadingOrders,
}));

export default selector;
