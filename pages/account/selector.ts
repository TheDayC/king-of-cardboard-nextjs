import { createSelector } from '@reduxjs/toolkit';

import { selectGlobalData } from '../../store/state/selectors';

const selector = createSelector([selectGlobalData], (global) => ({
    userTokenExpiry: global.userTokenExpiry,
}));

export default selector;
