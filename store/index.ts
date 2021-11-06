import { createStore, applyMiddleware } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';

import rootReducer from './slices';
import { createInitialState } from './state';

/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-ignore
let rehydrationComplete;
let rehydrationFailed;

const persistConfig = {
    key: 'root',
    storage,
    whitelist: ['cart', 'checkout', 'global', 'confirmation', 'pages'],
};

const rehydrationPromise = new Promise((resolve, reject) => {
    rehydrationComplete = resolve;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    rehydrationFailed = reject;
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function rehydration(): Promise<any> {
    return rehydrationPromise;
}

const persistedReducer = persistReducer(persistConfig, rootReducer);

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const storeInstance = () => {
    // Create our store and allow thunks for future development if required.
    const store = createStore(persistedReducer, createInitialState(), composeWithDevTools(applyMiddleware(thunk)));
    const persistor = persistStore(store, null, () => {
        // @ts-ignore
        rehydrationComplete();
    });

    return {
        store,
        persistor,
    };
};

export default storeInstance;
