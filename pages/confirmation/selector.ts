import { createSelector } from '@reduxjs/toolkit';

import { selectConfirmationData } from '../../store/state/selectors';

const selector = createSelector([selectConfirmationData], (confirmation) => ({
    confirmationOrder: confirmation.order,
}));

export default selector;
