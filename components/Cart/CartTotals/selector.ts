import { createSelector } from '@reduxjs/toolkit';

import { selectCartData, selectProductData, selectCheckoutData } from '../../../store/state/selectors';
import { createFullItemData } from '../../../utils/cart';

const selector = createSelector(
    [selectCartData, selectProductData, selectCheckoutData],
    (cart, products, checkout) => ({
        fullCartItemData: createFullItemData(products, cart.items),
        taxRate: checkout.taxRate,
    })
);

export default selector;
