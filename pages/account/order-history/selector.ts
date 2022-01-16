import { createSelector } from '@reduxjs/toolkit';

import { selectGlobalData, selectAccountData } from '../../../store/state/selectors';

const selector = createSelector([selectGlobalData, selectAccountData], (global, account) => ({
    accessToken: global.accessToken,
    order: account.currentOrder,
    isLoadingOrder: account.isLoadingOrder,
}));

export default selector;
