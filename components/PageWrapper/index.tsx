import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';

import Header from '../Header';
import Footer from '../Footer';
import GDPR from '../GDPR';
import * as ga from '../../lib/ga';

export const PageWrapper: React.FC = ({ children }) => {
    const router = useRouter();
    const cookieConsent = Boolean(Cookies.get('cookieConsent'));

    // Some GA subscribers.
    useEffect(() => {
        if (cookieConsent && router && router.events) {
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
    }, [router, cookieConsent]);

    return (
        <React.Fragment>
            <Header />
            <div className="block w-full relative bg-primary-content p-4 md:p-6 lg:p-8">
                <div className="container mx-auto">{children}</div>
            </div>
            <Footer />
            <GDPR />
        </React.Fragment>
    );
};

export default PageWrapper;
