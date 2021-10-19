import { createSelector } from '@reduxjs/toolkit';

import { selectConfirmationData, selectGlobalData } from '../../store/state/selectors';

const selector = createSelector([selectConfirmationData, selectGlobalData], (confirmation, global) => ({
    accessToken: global.accessToken,
    confirmationOrder: confirmation.order,
}));

export default selector;
