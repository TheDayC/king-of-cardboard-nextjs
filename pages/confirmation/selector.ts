import { createSelector } from '@reduxjs/toolkit';

import { selectConfirmationData, selectGlobalData } from '../../store/state/selectors';

const selector = createSelector([selectConfirmationData, selectGlobalData], (confirmation, global) => ({
    accessToken: global.accessToken,
    confirmationOrderNumber: confirmation.orderNumber,
}));

export default selector;
