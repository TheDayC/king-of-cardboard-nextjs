import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import Head from 'next/head';
import { useSelector } from 'react-redux';

import * as ga from '../../lib/ga';
import selector from './selector';
import Loading from '../Loading';
import Sidebar from './Sidebar';

const DEFAULT_IMAGE =
    'https://images.ctfassets.net/qeycwswfx7l5/2kAmPK2bBwIBHOWbylhgPz/8fdb6fd76bc2fb592592f96d7c4d343f/large-crown.png';

interface AccountWrapperProps {
    title: string;
    description: string;
    image?: string;
    children: React.ReactNode;
}

export const AccountWrapper: React.FC<AccountWrapperProps> = ({ title, description, image, children }) => {
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
                <div className="flex flex-row justify-start items-start bg-primary-content h-full">
                    <div className="w-80 bg-neutral py-2 h-full">
                        <Sidebar />
                    </div>
                    <div className="w-full">{children}</div>
                </div>
            )}
        </React.Fragment>
    );
};

export default AccountWrapper;
