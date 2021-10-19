import { createSelector } from '@reduxjs/toolkit';
import { sumBy } from 'lodash';

import { selectCartData } from '../../store/state/selectors';

const selector = createSelector([selectCartData], (cart) => {
    const items = cart.items;

    return {
        cartItemCount: items ? sumBy(items, (item) => (item.quantity ? item.quantity : 0)) : 0,
        orderId: cart.order ? cart.order.id : null,
        order: cart.order,
        items,
        isUpdatingCart: cart.isUpdatingCart,
    };
});

export default selector;
