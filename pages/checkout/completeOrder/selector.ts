import { createSelector } from '@reduxjs/toolkit';

import { selectGlobalData } from '../../../store/state/selectors';

const selector = createSelector([selectGlobalData], (global) => ({
    accessToken: global.accessToken,
    checkoutLoading: global.checkoutLoading,
}));

export default selector;
