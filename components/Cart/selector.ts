import { createSelector } from '@reduxjs/toolkit';
import { sortBy } from 'lodash';

import { selectCartData, selectGlobalData, selectAccountData } from '../../store/state/selectors';

const selector = createSelector([selectCartData, selectGlobalData, selectAccountData], (cart, global, account) => ({
    itemCount: cart.items.length,
    items: [...cart.items].sort((a, b) => a.title.localeCompare(b.title)),
    isUpdatingCart: cart.isUpdatingCart,
    accessToken: global.accessToken,
    orderId: cart.orderId,
    shouldUpdateCart: cart.shouldUpdateCart,
    balance: account.giftCard.balance,
    updateQuantities: cart.updateQuantities,
}));

export default selector;
