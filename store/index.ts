import { createStore, applyMiddleware } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';

import rootReducer from './slices';
import { createInitialState } from './state';

const persistConfig = {
    key: 'root',
    storage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export default () => {
    // Create our store and allow thunks for future development if required.
    const store = createStore(persistedReducer, createInitialState(), composeWithDevTools(applyMiddleware(thunk)));
    const persistor = persistStore(store);

    return {
        store,
        persistor,
    };
};
