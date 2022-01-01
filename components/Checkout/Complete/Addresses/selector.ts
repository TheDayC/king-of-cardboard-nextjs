import { createSelector } from '@reduxjs/toolkit';

import { selectCheckoutData } from '../../../../store/state/selectors';

const selector = createSelector([selectCheckoutData], (checkout) => ({
    customerDetails: checkout.customerDetails,
    billingAddress: checkout.billingAddress,
    shippingAddress: checkout.shippingAddress,
}));

export default selector;
