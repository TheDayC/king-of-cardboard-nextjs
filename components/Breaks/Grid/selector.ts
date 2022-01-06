import { createSelector } from '@reduxjs/toolkit';

import { selectBreaksData, selectGlobalData } from '../../../store/state/selectors';

const selector = createSelector([selectBreaksData, selectGlobalData], (breaks, global) => ({
    breaks: breaks.breaks,
    breaksTotal: breaks.breaksTotal,
    accessToken: global.accessToken,
}));

export default selector;