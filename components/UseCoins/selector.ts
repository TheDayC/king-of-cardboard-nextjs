import { createSelector } from '@reduxjs/toolkit';

import { selectAccountData } from '../../store/state/selectors';

const selector = createSelector([selectAccountData], (account) => ({
    coins: account.coins,
}));

export default selector;
