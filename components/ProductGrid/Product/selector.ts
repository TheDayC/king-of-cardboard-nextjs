import { createSelector } from '@reduxjs/toolkit';

import { selectProductData } from '../../../store/state/selectors';

const selector = createSelector([selectProductData], (products) => ({
    products,
}));

export default selector;
