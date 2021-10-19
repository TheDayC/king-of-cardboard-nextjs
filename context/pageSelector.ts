import { createSelector } from '@reduxjs/toolkit';

import { selectPageData } from '../store/state/selectors';

const selector = createSelector([selectPageData], (pagesData) => ({
    pages: pagesData.pages,
}));

export default selector;
