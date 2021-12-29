import { createSelector } from '@reduxjs/toolkit';

import { selectCheckoutData } from '../../../../store/state/selectors';

const selector = createSelector([selectCheckoutData], (checkout) => ({
    customerDetails: checkout.customerDetails,
}));

export default selector;
