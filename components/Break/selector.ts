import { createSelector } from '@reduxjs/toolkit';

import { selectGlobalData, selectBreaksData } from '../../store/state/selectors';

const selector = createSelector([selectGlobalData, selectBreaksData], (global, breaks) => ({
    currentBreak: breaks.currentBreak,
    isLoadingBreak: breaks.isLoadingBreak,
}));

export default selector;
