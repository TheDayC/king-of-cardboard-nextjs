import React from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

import Header from '../Header';
import Footer from '../Footer';
import GDPR from '../GDPR';
import { StockStatus } from '../../enums/products';

const DEFAULT_IMAGE =
    'https://images.ctfassets.net/qeycwswfx7l5/2kAmPK2bBwIBHOWbylhgPz/8fdb6fd76bc2fb592592f96d7c4d343f/large-crown.png';

interface ProductWrapperProps {
    title: string;
    description: string;
    image?: string;
    children: React.ReactNode;
    price: number;
    stockStatus: StockStatus;
    sku: string;
}

export const ProductWrapper: React.FC<ProductWrapperProps> = ({
    title,
    description,
    image,
    children,
    price,
    stockStatus,
    sku,
}) => {
    const router = useRouter();
    //const cookieConsent = Boolean(Cookies.get('cookieConsent'));
    const imageURL = image ? image : DEFAULT_IMAGE;
    const brand = title.includes('Topps') ? 'Topps' : 'Panini';
    const metaPrice = (price / 100).toFixed(2);
    const status = stockStatus === StockStatus.OutOfStock ? 'out of stock' : 'in stock';

    // Some GA subscribers.
    /* useEffect(() => {
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
    }, [router, cookieConsent]); */

    return (
        <React.Fragment>
            <Head>
                <title>{title}</title>
                <meta name="robots" content="index,follow" />
                <meta property="og:title" content={title} />
                <meta name="description" content={description} />
                <meta property="og:description" content={description} />
                <meta property="og:image" content={imageURL} />
                <meta property="og:url" content={`https://www.kingofcardboard.co.uk${router.asPath}`} />
                <meta property="og:type" content="website" />
                <meta property="og:price:currency" content="GBP" />
                <meta property="og:price:amount" content={`${metaPrice}`} />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:site" content="@kocardboard" />
                <meta name="twitter:title" content={title} />
                <meta name="twitter:description" content={description} />
                <meta name="twitter:image" content={imageURL} />
                <meta property="product:brand" content={brand} />
                <meta property="product:availability" content={status} />
                <meta property="product:condition" content="new" />
                <meta property="product:price:currency" content="GBP" />
                <meta property="product:price:amount" content={`${metaPrice}`} />
                <meta property="product:retailer_item_id" content={sku} />
                <meta property="product:category" content="3865" />
            </Head>
            <Header />
            <div className="block w-full relative bg-primary-content p-4 md:p-6 lg:p-8">
                <div className="container mx-auto">{children}</div>
            </div>
            <Footer />
            <GDPR />
        </React.Fragment>
    );
};

export default ProductWrapper;
