import { Provider } from 'react-redux';
import type { AppProps } from 'next/app';
import { PersistGate } from 'redux-persist/integration/react';

import storeInstance from '../store';
import '../styles/globals.css';
import AuthProvider from '../context/authProvider';

const MyApp: React.FC<AppProps> = ({ Component, pageProps }) => {
    const { store, persistor } = storeInstance();

    return (
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <AuthProvider>
                    <Component {...pageProps} />
                </AuthProvider>
            </PersistGate>
        </Provider>
    );
};

export default MyApp;
