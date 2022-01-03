import { createSelector } from '@reduxjs/toolkit';

import { selectGlobalData, selectBreaksData } from '../../../../store/state/selectors';

const selector = createSelector([selectGlobalData, selectBreaksData], (global, breaks) => ({
    breakSlots: breaks.currentBreak.breakSlots,
}));

export default selector;
