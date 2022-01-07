import { useStore } from 'react-redux';
import type { AppProps } from 'next/app';
import { PersistGate } from 'redux-persist/integration/react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { SessionProvider } from 'next-auth/react';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';

import { wrapper } from '../store';
import '../styles/globals.css';
import OrderAndTokenProvider from '../context/OrderAndTokenProvider';
import PageProvider from '../context/PageProvider';
import Drawer from '../components/Drawer';
import Alert from '../components/Alert';
import * as ga from '../lib/ga';

// Called outside of the render to only create once.
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

const MyApp: React.FC<AppProps> = ({ Component, pageProps: { session, ...pageProps } }) => {
    const store = useStore();
    const router = useRouter();
    const cookieConsent = Boolean(Cookies.get('cookieConsent'));

    // Some GA subscribers.
    useEffect(() => {
        if (cookieConsent) {
            const handleRouteChange = (url: string) => {
                ga.pageview(url);
            };

            //When the component is mounted, subscribe to router changes
            //and log those page views
            router.events.on('routeChangeComplete', handleRouteChange);

            // If the component is unmounted, unsubscribe
            // from the event with the `off` method
            return () => {
                router.events.off('routeChangeComplete', handleRouteChange);
            };
        }
    }, [router.events, cookieConsent]);

    if (cookieConsent) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const persistor = store.__persistor;

        return (
            <PersistGate persistor={persistor} loading={<div>Loading</div>}>
                <SessionProvider session={session}>
                    <OrderAndTokenProvider>
                        <PageProvider>
                            <Elements stripe={stripePromise}>
                                <Drawer>
                                    <Component {...pageProps} />
                                    <Alert />
                                </Drawer>
                            </Elements>
                        </PageProvider>
                    </OrderAndTokenProvider>
                </SessionProvider>
            </PersistGate>
        );
    } else {
        return (
            <OrderAndTokenProvider>
                <PageProvider>
                    <Elements stripe={stripePromise}>
                        <Drawer>
                            <Component {...pageProps} />
                            <Alert />
                        </Drawer>
                    </Elements>
                </PageProvider>
            </OrderAndTokenProvider>
        );
    }
};

export default wrapper.withRedux(MyApp);
