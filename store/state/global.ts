import { Global } from '../types/state';

const globalInitialState: Global = {
    checkoutLoading: false,
    accessToken: null,
    userToken: null,
    expires: null,
    hasRejected: false,
    sessionEmail: null,
    showNewsBanner: true,
};

export default globalInitialState;
