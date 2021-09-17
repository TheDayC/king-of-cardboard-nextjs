import { createSelector } from '@reduxjs/toolkit';
import { sumBy } from 'lodash';

import { selectCartData, selectProductData } from '../../store/state/selectors';
import { createFullItemData } from '../../utils/cart';

const selector = createSelector([selectCartData, selectProductData], (cart, products) => ({
    cartItemCount: sumBy(cart, (cartItem) => cartItem.amount),
    fullCartItemData: createFullItemData(products, cart),
}));

export default selector;
