import { createSelector } from '@reduxjs/toolkit';

import { selectCartData, selectProductData, selectCheckoutData } from '../../../store/state/selectors';
import { createFullItemData } from '../../../utils/cart';

const selector = createSelector(
    [selectCartData, selectProductData, selectCheckoutData],
    (cart, products, checkout) => ({
        fullCartItemData: createFullItemData(products, cart),
        subTotal: checkout.subTotal,
        taxes: checkout.taxes,
        total: checkout.total,
    })
);

export default selector;
