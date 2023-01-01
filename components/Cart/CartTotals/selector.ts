import { createSelector } from '@reduxjs/toolkit';

import { selectCartData } from '../../../store/state/selectors';
import { getPrettyPrice } from '../../../utils/account/products';

const selector = createSelector([selectCartData], (cart) => ({
    subTotal: getPrettyPrice(cart.subTotal),
    shipping: getPrettyPrice(cart.shipping),
    discount: getPrettyPrice(cart.discount),
    total: getPrettyPrice(cart.total),
}));

export default selector;
