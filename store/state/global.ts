import { Global } from '../types/state';

const globalInitialState: Global = {
    checkoutLoading: false,
    accessToken: null,
    expires: null,
    shouldSetNewOrder: false,
    shouldShowDrawer: false,
};

export default globalInitialState;
