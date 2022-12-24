import { createSelector } from '@reduxjs/toolkit';

import { selectCheckoutData } from '../../../../../store/state/selectors';

const selector = createSelector([selectCheckoutData], (checkout) => ({
    cloneBillingAddressId: checkout.cloneBillingAddressId,
    cloneShippingAddressId: checkout.cloneShippingAddressId,
}));

export default selector;
