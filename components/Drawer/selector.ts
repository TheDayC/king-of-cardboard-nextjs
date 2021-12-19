import { createSelector } from '@reduxjs/toolkit';

import { selectGlobalData } from '../../store/state/selectors';

const selector = createSelector([selectGlobalData], (global) => ({
    shouldShowDrawer: global.shouldShowDrawer,
}));

export default selector;
