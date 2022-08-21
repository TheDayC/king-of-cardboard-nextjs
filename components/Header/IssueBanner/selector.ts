import { createSelector } from '@reduxjs/toolkit';

import { selectGlobalData } from '../../../store/state/selectors';

const selector = createSelector([selectGlobalData], (global) => ({
    showNewsBanner: global.showNewsBanner,
}));

export default selector;
