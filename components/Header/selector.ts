import { createSelector } from '@reduxjs/toolkit';
import { sumBy } from 'lodash';

import { selectCartData } from '../../store/state/selectors';

const selector = createSelector([selectCartData], (cart) => ({
    cartItemCount: sumBy(cart, (cartItem) => cartItem.amount),
}));

export default selector;
