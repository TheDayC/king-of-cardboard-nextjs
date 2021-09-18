import { createSelector } from '@reduxjs/toolkit';

import { selectCheckoutData } from '../../../../store/state/selectors';

const selector = createSelector([selectCheckoutData], (checkout) => ({
    subTotal: checkout.subTotal,
    taxes: checkout.taxes,
    total: checkout.total,
    taxRate: checkout.taxRate,
}));

export default selector;
