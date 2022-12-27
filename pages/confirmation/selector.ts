import { createSelector } from '@reduxjs/toolkit';

import { selectConfirmationData } from '../../store/state/selectors';

const selector = createSelector([selectConfirmationData], (confirmation) => ({
    orderNumber: confirmation.orderNumber,
}));

export default selector;
