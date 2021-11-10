import { createSelector } from '@reduxjs/toolkit';

import { selectPageData } from '../../store/state/selectors';

const selector = createSelector([selectPageData], (pageData) => ({
    pages: pageData.pages || null,
}));

export default selector;
