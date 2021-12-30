import { createSelector } from '@reduxjs/toolkit';

import { selectCheckoutData } from '../../../../store/state/selectors';

const selector = createSelector([selectCheckoutData], (checkout) => ({
    isShippingSameAsBilling: checkout.isShippingSameAsBilling,
}));

export default selector;
