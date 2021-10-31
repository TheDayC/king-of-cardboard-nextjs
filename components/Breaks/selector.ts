import { createSelector } from '@reduxjs/toolkit';

import { selectBreaksData } from '../../store/state/selectors';

const selector = createSelector([selectBreaksData], (breakData) => ({
    isLoadingBreaks: breakData.isLoadingBreaks,
}));

export default selector;
