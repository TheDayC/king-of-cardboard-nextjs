import { Provider } from 'react-redux';
import type { AppProps } from 'next/app';
import { PersistGate } from 'redux-persist/integration/react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { SessionProvider } from 'next-auth/react';

import storeInstance from '../store';
import '../styles/globals.css';
import AuthProvider from '../context/authProvider';
import PageProvider from '../context/pageProvider';

// Called outside of the render to only create once.
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

const MyApp: React.FC<AppProps> = ({ Component, pageProps: { session, ...pageProps } }) => {
    const { store, persistor } = storeInstance();

    return (
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <SessionProvider session={session}>
                    <AuthProvider>
                        <PageProvider>
                            <Elements stripe={stripePromise}>
                                <Component {...pageProps} />
                            </Elements>
                        </PageProvider>
                    </AuthProvider>
                </SessionProvider>
            </PersistGate>
        </Provider>
    );
};

export default MyApp;
