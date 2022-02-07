import { createSelector } from '@reduxjs/toolkit';

import { selectBreaksData } from '../../../../store/state/selectors';

const selector = createSelector([selectBreaksData], (breaks) => ({
    order: breaks.order,
}));

export default selector;
