import { createSelector } from '@reduxjs/toolkit';
import { sumBy } from 'lodash';

import { selectCartData, selectProductData } from '../../store/state/selectors';
import { createFullItemData } from '../../utils/cart';

const selector = createSelector([selectCartData, selectProductData], (cart, products) => ({
    cartItemCount: sumBy(cart.items, (cartItem) => cartItem.amount),
    fullCartItemData: createFullItemData(products, cart.items),
    orderId: cart.order ? cart.order.id : null,
    order: cart.order,
    items: cart.order ? cart.order.line_items : null,
}));

export default selector;
