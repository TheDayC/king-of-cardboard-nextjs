import { createSelector } from '@reduxjs/toolkit';

import { selectErrorData } from '../../store/state/selectors';

const selector = createSelector([selectErrorData], (errorData) => ({
    errors: errorData.errors,
}));

export default selector;
