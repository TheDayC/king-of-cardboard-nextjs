import { createSelector } from '@reduxjs/toolkit';

import { selectConfirmationData } from '../../store/state/selectors';

const selector = createSelector([selectConfirmationData], (confirmation) => ({
    customerDetails: confirmation.customerDetails,
    billingAddress: confirmation.billingAddress,
    shippingAddress: confirmation.shippingAddress,
}));

export default selector;
