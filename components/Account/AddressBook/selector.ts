import { createSelector } from '@reduxjs/toolkit';

import { selectGlobalData, selectAccountData } from '../../../store/state/selectors';

const selector = createSelector([selectGlobalData, selectAccountData], (global, account) => ({
    accessToken: global.userToken || global.accessToken,
    userToken: global.userToken,
    addresses: account.addresses,
}));

export default selector;
