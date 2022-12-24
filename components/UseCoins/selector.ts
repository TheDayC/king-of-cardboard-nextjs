import { createSelector } from '@reduxjs/toolkit';

import { selectCartData } from '../../store/state/selectors';

const selector = createSelector([selectCartData], (cart) => ({
    shouldUseCoins: cart.shouldUseCoins,
}));

export default selector;
