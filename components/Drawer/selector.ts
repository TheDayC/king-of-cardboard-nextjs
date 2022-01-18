import { createSelector } from '@reduxjs/toolkit';

import { selectGlobalData } from '../../store/state/selectors';

const selector = createSelector([selectGlobalData], (global) => ({
    isDrawerOpen: global.isDrawerOpen,
}));

export default selector;
