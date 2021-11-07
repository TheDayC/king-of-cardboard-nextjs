import { createSelector } from '@reduxjs/toolkit';

import { selectPageData } from '../../store/state/selectors';

const selector = createSelector([selectPageData], (pageData) => ({
    page: pageData.pages.find((page) => page.title.toLowerCase() === 'account') || null,
}));

export default selector;
