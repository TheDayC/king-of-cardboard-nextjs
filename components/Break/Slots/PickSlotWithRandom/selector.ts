import { createSelector } from '@reduxjs/toolkit';

import { selectGlobalData, selectBreaksData } from '../../../../store/state/selectors';

const selector = createSelector([selectGlobalData, selectBreaksData], (global, breaks) => ({
    accessToken: global.accessToken,
    currentBreak: breaks.currentBreak,
}));

export default selector;
