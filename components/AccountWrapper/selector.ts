import { createSelector } from '@reduxjs/toolkit';

import { selectGlobalData } from '../../store/state/selectors';

const selector = createSelector([selectGlobalData], (global) => ({
    isFetchingToken: global.isFetchingToken,
}));

export default selector;
