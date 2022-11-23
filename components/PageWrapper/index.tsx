import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import Head from 'next/head';
import { useSelector } from 'react-redux';

import Header from '../Header';
import Footer from '../Footer';
import GDPR from '../GDPR';
import * as ga from '../../lib/ga';
import selector from './selector';
import Loading from '../Loading';

const DEFAULT_IMAGE =
    'https://images.ctfassets.net/qeycwswfx7l5/2kAmPK2bBwIBHOWbylhgPz/8fdb6fd76bc2fb592592f96d7c4d343f/large-crown.png';

interface PageWrapperProps {
    title: string;
    description: string;
    image?: string;
    children: React.ReactNode;
}

export const PageWrapper: React.FC<PageWrapperProps> = ({ title, description, image, children }) => {
    const router = useRouter();
    const cookieConsent = Boolean(Cookies.get('cookieConsent'));
    const { isFetchingToken } = useSelector(selector);
    const imageURL = image ? image : DEFAULT_IMAGE;

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
            <Head>
                <title>{title}</title>
                <meta property="og:title" content={title} />
                <meta name="description" content={description} />
                <meta property="og:description" content={description} />
                <meta property="og:image" content={imageURL} />
                <meta property="og:url" content={`https://www.kingofcardboard.co.uk${router.asPath}`} />
                <meta property="og:type" content="website" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:site" content="@kocardboard" />
                <meta name="twitter:title" content={title} />
                <meta name="twitter:description" content={description} />
                <meta name="twitter:image" content={imageURL} />
            </Head>
            {isFetchingToken ? (
                <Loading show={true} />
            ) : (
                <React.Fragment>
                    <Header />
                    <div className="block w-full relative bg-primary-content p-4 md:p-6 lg:p-8">
                        <div className="container mx-auto">{children}</div>
                    </div>
                    <Footer />
                    <GDPR />
                </React.Fragment>
            )}
        </React.Fragment>
    );
};

export default PageWrapper;
