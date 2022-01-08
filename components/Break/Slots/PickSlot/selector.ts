import { createSelector } from '@reduxjs/toolkit';

import { selectBreaksData } from '../../../../store/state/selectors';

const selector = createSelector([selectBreaksData], (breaks) => ({
    currentBreak: breaks.currentBreak,
}));

export default selector;
