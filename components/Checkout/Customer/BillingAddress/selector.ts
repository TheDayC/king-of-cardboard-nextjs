import { createSelector } from '@reduxjs/toolkit';

import { selectCheckoutData } from '../../../../store/state/selectors';

const selector = createSelector([selectCheckoutData], (checkout) => ({
    billingAddress: checkout.billingAddress,
}));

export default selector;
