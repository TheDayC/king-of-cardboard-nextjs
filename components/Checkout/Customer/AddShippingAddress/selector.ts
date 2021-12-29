import { createSelector } from '@reduxjs/toolkit';

import { selectCartData, selectCheckoutData, selectGlobalData } from '../../../../store/state/selectors';

const selector = createSelector([selectCheckoutData, selectCartData, selectGlobalData], (checkout, cart, global) => ({
    orderId: cart.order ? cart.order.id : null,
    accessToken: global.accessToken,
    isShippingSameAsBilling: checkout.isShippingSameAsBilling,
}));

export default selector;
