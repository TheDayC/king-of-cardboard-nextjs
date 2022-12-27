import { createSelector } from '@reduxjs/toolkit';

import { selectAccountData } from '../../../store/state/selectors';

const selector = createSelector([selectAccountData], (account) => ({
    addresses: account.addresses,
    isLoadingAddressBook: account.isLoadingAddressBook,
}));

export default selector;
