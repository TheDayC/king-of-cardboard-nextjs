import { createSelector } from '@reduxjs/toolkit';

import { selectCartData, selectProductData, selectCheckoutData } from '../../../store/state/selectors';

const selector = createSelector(
    [selectCartData, selectProductData, selectCheckoutData],
    (cart, products, checkout) => ({
        subTotal: checkout.subTotal,
        taxes: checkout.taxes,
        total: checkout.total,
    })
);

export default selector;
