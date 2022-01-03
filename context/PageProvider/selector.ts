import { createSelector } from '@reduxjs/toolkit';

import { selectPageData } from '../../store/state/selectors';

const selector = createSelector([selectPageData], (pages) => ({
    shouldLoadPages: pages.shouldLoadPages,
}));

export default selector;
