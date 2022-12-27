import { createSelector } from '@reduxjs/toolkit';

import { selectCheckoutData } from '../../../../../store/state/selectors';

const selector = createSelector([selectCheckoutData], (checkout) => ({
    existingBillingAddressId: checkout.existingBillingAddressId,
    existingShippingAddressId: checkout.existingShippingAddressId,
}));

export default selector;
