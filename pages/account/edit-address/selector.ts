import { createSelector } from '@reduxjs/toolkit';

import { selectAccountData } from '../../../store/state/selectors';

const selector = createSelector([selectAccountData], (account) => ({
    currentAddress: account.currentAddress,
}));

export default selector;
