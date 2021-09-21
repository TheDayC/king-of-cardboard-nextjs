import { createSelector } from '@reduxjs/toolkit';
import { sumBy } from 'lodash';

import { selectCartData } from '../../store/state/selectors';

const selector = createSelector([selectCartData], (cart) => {
    const items = cart.order ? cart.order.line_items : null;

    return {
        cartItemCount: items ? sumBy(items, (item) => (item.quantity ? item.quantity : 0)) : 0,
        orderId: cart.order ? cart.order.id : null,
        order: cart.order,
        items,
    };
});

export default selector;
