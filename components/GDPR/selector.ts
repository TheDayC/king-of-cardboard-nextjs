import { createSelector } from '@reduxjs/toolkit';

import { selectGlobalData } from '../../store/state/selectors';

const selector = createSelector([selectGlobalData], (global) => ({
    hasRejected: global.hasRejected,
}));

export default selector;
