import { createSelector } from '@reduxjs/toolkit';

import { selectAccountData } from '../../../store/state/selectors';

const selector = createSelector([selectAccountData], (account) => ({
    addresses: account.addresses,
}));

export default selector;
