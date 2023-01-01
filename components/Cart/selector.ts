import { createSelector } from '@reduxjs/toolkit';

import { selectCartData, selectAccountData } from '../../store/state/selectors';

const selector = createSelector([selectCartData, selectAccountData], (cart, account) => ({
    itemCount: cart.items.length,
    items: [...cart.items].sort((a, b) => a.title.localeCompare(b.title)),
    isUpdatingCart: cart.isUpdatingCart,
    coins: account.coins,
}));

export default selector;
