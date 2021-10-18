import { createSelector } from '@reduxjs/toolkit';

import { selectGlobalData, selectCheckoutData } from '../../store/state/selectors';

const selector = createSelector([selectGlobalData, selectCheckoutData], (global, checkout) => ({
    customerDetails: checkout.customerDetails,
    shouldSetNewOrder: global.shouldSetNewOrder,
}));

export default selector;
