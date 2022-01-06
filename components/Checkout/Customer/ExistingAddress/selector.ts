import { createSelector } from '@reduxjs/toolkit';

import { selectGlobalData, selectAccountData } from '../../../../store/state/selectors';

const selector = createSelector([selectGlobalData, selectAccountData], (global, account) => ({
    accessToken: global.accessToken,
    checkoutLoading: global.checkoutLoading,
    addresses: account.addresses,
}));

export default selector;
