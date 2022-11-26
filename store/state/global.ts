import { Global } from '../types/state';

const globalInitialState: Global = {
    checkoutLoading: false,
    accessToken: null,
    userToken: null,
    userTokenExpiry: null,
    isFetchingToken: false,
    userId: null,
    expires: null,
    hasRejected: false,
    sessionEmail: null,
    isDrawerOpen: false,
};

export default globalInitialState;
