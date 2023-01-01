import { createSelector } from '@reduxjs/toolkit';

import { selectCartData, selectConfirmationData } from '../../../../store/state/selectors';
import { getPrettyPrice } from '../../../../utils/account/products';

const selector = createSelector([selectCartData, selectConfirmationData], (cart, confirmation) => ({
    cartSubTotal: getPrettyPrice(cart.subTotal),
    cartShipping: getPrettyPrice(cart.shipping),
    cartDiscount: getPrettyPrice(cart.discount),
    cartTotal: getPrettyPrice(cart.total),
    confirmationSubTotal: confirmation.subTotal,
    confirmationShipping: confirmation.shipping,
    confirmationDiscount: confirmation.discount,
    confirmationTotal: confirmation.total,
}));

export default selector;
