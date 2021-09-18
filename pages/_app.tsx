import { Provider } from 'react-redux';
import type { AppProps } from 'next/app';
import { PersistGate } from 'redux-persist/integration/react';
import {
    getSalesChannelToken,
    getCustomerToken,
    getIntegrationToken,
    authorizeWebapp,
    getWebappToken,
} from '@commercelayer/js-auth';

import storeInstance from '../store';
import '../styles/globals.css';
import { useEffect } from 'react';

const MyApp: React.FC<AppProps> = ({ Component, pageProps }) => {
    const { store, persistor } = storeInstance();
    // console.log(token);
    //const authCommerceLayer = async () => {
    /* const baseCommerceLayerConfig = {
            clientId: process.env.NEXT_PUBLIC_ECOM_CLIENT_ID || '',
            clientSecret: process.env.NEXT_PUBLIC_ECOM_CLIENT_SECRET || '',
            callbackUrl: 'http://localhost:3000/',
            endpoint: process.env.NEXT_PUBLIC_ECOM_DOMAIN || '',
            scope: 'market:GgeMQhmrkg',
        };

        authorizeWebapp(baseCommerceLayerConfig);

        const token = await getWebappToken({
            ...baseCommerceLayerConfig,
            callbackUrlWithCode: 'http://localhost:3000/?code=your-auth-code', // triggers the access token request
        });

        console.log('My access token: ', token.accessToken)
        console.log('Expiration date: ', token.expires) */
    /* console.log("🚀 ~ file: _app.tsx ~ line 43 ~ authCommerceLayer ~ process.env.REACT_APP_ECOM_DOMAIN", process.env.NEXT_PUBLIC_ECOM_DOMAIN)

        const token = await getSalesChannelToken({
            clientId: process.env.NEXT_PUBLIC_ECOM_CLIENT_ID || '',
            endpoint: process.env.NEXT_PUBLIC_ECOM_DOMAIN || '',
            scope: 'market:GgeMQhmrkg',
        })

        console.log('My access token: ', token.accessToken)
        console.log('Expiration date: ', token.expires) */
    //};

    /* useEffect(() => {
        authCommerceLayer();
    }, []) */

    return (
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <Component {...pageProps} />
            </PersistGate>
        </Provider>
    );
};

export default MyApp;
