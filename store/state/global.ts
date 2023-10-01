import { Global } from '../types/state';

const globalInitialState: Global = {
    checkoutLoading: false,
    userId: null,
    expires: null,
    hasRejected: false,
    sessionEmail: null,
    isDrawerOpen: false,
    isSearchOpen: false,
};

export default globalInitialState;
