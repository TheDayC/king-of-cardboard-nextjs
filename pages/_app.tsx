import React from 'react';
import { useStore } from 'react-redux';
import type { AppProps } from 'next/app';
import { PersistGate } from 'redux-persist/integration/react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { SessionProvider } from 'next-auth/react';
import Script from 'next/script';
import Cookies from 'js-cookie';

import { wrapper } from '../store';
import '../styles/globals.css';
import OrderAndTokenProvider from '../context/OrderAndTokenProvider';
import Drawer from '../components/Drawer';
import Alert from '../components/Alert';

// Called outside of the render to only create once.
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

const MyApp: React.FC<AppProps> = ({ Component, pageProps: { session, ...pageProps } }) => {
    const store = useStore();

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const persistor = store.__persistor;
    const cookieConsent = Boolean(Cookies.get('cookieConsent'));

    return (
        <PersistGate persistor={persistor} loading={<div>Loading</div>}>
            <SessionProvider session={session}>
                <OrderAndTokenProvider>
                    <Elements stripe={stripePromise}>
                        <Drawer>
                            {/* Global Site Tag (gtag.js) - Google Analytics */}
                            {cookieConsent && (
                                <React.Fragment>
                                    <Script
                                        strategy="afterInteractive"
                                        src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}`}
                                    />
                                    <Script
                                        id="gtag-init"
                                        strategy="afterInteractive"
                                        dangerouslySetInnerHTML={{
                                            __html: `
                                                window.dataLayer = window.dataLayer || [];
                                                function gtag(){dataLayer.push(arguments);}
                                                gtag('js', new Date());
                                                gtag('config', '${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}', {
                                                page_path: window.location.pathname,
                                                });
                                            `,
                                        }}
                                    />
                                </React.Fragment>
                            )}
                            <Script
                                id="facebook-pixel-script"
                                strategy="afterInteractive"
                                dangerouslySetInnerHTML={{
                                    __html: `
                                        !function(f,b,e,v,n,t,s)
  {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
  n.callMethod.apply(n,arguments):n.queue.push(arguments)};
  if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
  n.queue=[];t=b.createElement(e);t.async=!0;
  t.src=v;s=b.getElementsByTagName(e)[0];
  s.parentNode.insertBefore(t,s)}(window, document,'script',
  'https://connect.facebook.net/en_US/fbevents.js');
  fbq('init', ${process.env.FB_PIXEL_ID});
  fbq('track', 'PageView');
                                    `,
                                }}
                            />
                            <Component {...pageProps} />
                            <Alert />
                        </Drawer>
                    </Elements>
                </OrderAndTokenProvider>
            </SessionProvider>
        </PersistGate>
    );
};

export default wrapper.withRedux(MyApp);
