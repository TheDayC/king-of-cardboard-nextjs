import { Global } from '../types/state';

const globalInitialState: Global = {
    checkoutLoading: false,
    accessToken: null,
    userToken: null,
    isFetchingToken: false,
    userId: null,
    expires: null,
    hasRejected: false,
    sessionEmail: null,
    showNewsBanner: true,
    isDrawerOpen: false,
};

export default globalInitialState;
