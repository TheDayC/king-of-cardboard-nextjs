import { createSelector } from '@reduxjs/toolkit';

import { selectBreaksData } from '../../../store/state/selectors';

const selector = createSelector([selectBreaksData], (breaks) => ({
    breaks: breaks.breaks,
    breaksTotal: breaks.breaksTotal,
    isLoadingBreaks: breaks.isLoadingBreaks,
}));

export default selector;
