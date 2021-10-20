import { createSelector } from '@reduxjs/toolkit';

import { selectShopData } from '../../store/state/selectors';

const selector = createSelector([selectShopData], (shopData) => ({
    isLoadingProducts: shopData.isLoadingProducts,
}));

export default selector;
