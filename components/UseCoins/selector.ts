import { createSelector } from '@reduxjs/toolkit';

import { selectGlobalData, selectAccountData, selectCartData } from '../../store/state/selectors';

const selector = createSelector([selectGlobalData, selectAccountData, selectCartData], (global, account, cart) => ({
    accessToken: global.accessToken,
    orderId: cart.orderId,
    code: account.giftCard.code,
    orderHasGiftCard: cart.orderHasGiftCard,
}));

export default selector;
