import { Global } from '../types/state';

const globalInitialState: Global = {
    checkoutLoading: false,
    accessToken: null,
    expires: null,
    shouldSetNewOrder: false,
};

export default globalInitialState;
