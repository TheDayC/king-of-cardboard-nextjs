import { createSelector } from '@reduxjs/toolkit';
import { sumBy } from 'lodash';

import { selectCartData, selectGlobalData } from '../../store/state/selectors';

const selector = createSelector([selectCartData, selectGlobalData], (cart, global) => {
    const items = cart.items;

    return {
        cartItemCount: items ? sumBy(items, (item) => (item.quantity ? item.quantity : 0)) : 0,
        items,
        isUpdatingCart: cart.isUpdatingCart,
        accessToken: global.accessToken,
    };
});

export default selector;
