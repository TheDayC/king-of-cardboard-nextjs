import { createSelector } from '@reduxjs/toolkit';

import { selectGlobalData } from '../../../store/state/selectors';

const selector = createSelector([selectGlobalData], (globalData) => ({
    accessToken: globalData.accessToken,
    shouldFetchRewards: globalData.shouldFetchRewards,
}));

export default selector;
