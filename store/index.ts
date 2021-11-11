import { configureStore, ThunkAction } from '@reduxjs/toolkit';
import { Action } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import thunkMiddleware from 'redux-thunk';
import { createWrapper } from 'next-redux-wrapper';

import rootReducer from './slices';

const persistConfig = {
    key: 'root',
    storage,
    whitelist: ['cart', 'checkout', 'global', 'confirmation', 'pages', 'breaks', 'account'],
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const makeConfiguredStore = (rootReducer: any) =>
    configureStore({
        reducer: rootReducer,
        middleware: [thunkMiddleware],
        devTools: true,
    });

const makeStore = () => {
    const isServer = typeof window === 'undefined';

    if (isServer) {
        return makeConfiguredStore(rootReducer);
    } else {
        const persistedReducer = persistReducer(persistConfig, rootReducer);
        const store = makeConfiguredStore(persistedReducer);

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        store.__persistor = persistStore(store); // Nasty hack

        return store;
    }
};

export type AppStore = ReturnType<typeof makeStore>;
export type AppState = ReturnType<AppStore['getState']>;
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, AppState, unknown, Action>;

export const wrapper = createWrapper<AppStore>(makeStore, { debug: true });
