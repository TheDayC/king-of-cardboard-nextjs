import { createSelector } from '@reduxjs/toolkit';

import { selectGlobalData, selectCartData, selectCheckoutData } from '../../../../../store/state/selectors';

const selector = createSelector([selectGlobalData, selectCartData, selectCheckoutData], (global, cart, checkout) => ({
    accessToken: global.accessToken,
    orderId: cart.order ? cart.order.id : null,
    cloneAddressId: checkout.cloneAddressId,
}));

export default selector;
