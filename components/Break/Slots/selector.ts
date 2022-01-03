import { createSelector } from '@reduxjs/toolkit';

import { selectBreaksData } from '../../../store/state/selectors';

const selector = createSelector([selectBreaksData], (breaks) => ({
    format: breaks.currentBreak.format,
}));

export default selector;
