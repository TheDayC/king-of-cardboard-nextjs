import { createSelector } from '@reduxjs/toolkit';

import { selectAccountData } from '../../../../store/state/selectors';

const selector = createSelector([selectAccountData], (accountData) => ({
    socialMedia: accountData.socialMedia,
}));

export default selector;
