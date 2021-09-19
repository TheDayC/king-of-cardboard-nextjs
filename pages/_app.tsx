import { Provider } from 'react-redux';
import type { AppProps } from 'next/app';
import { PersistGate } from 'redux-persist/integration/react';

import storeInstance from '../store';
import '../styles/globals.css';

const MyApp: React.FC<AppProps> = ({ Component, pageProps }) => {
    const { store, persistor } = storeInstance();

    return (
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <Component {...pageProps} />
            </PersistGate>
        </Provider>
    );
};

export default MyApp;
