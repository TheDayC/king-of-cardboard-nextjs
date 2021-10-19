import { Global } from '../types/state';

const globalInitialState: Global = {
    checkoutLoading: false,
    accessToken: null,
    expires: null,
    setNewOrder: false,
};

export default globalInitialState;
