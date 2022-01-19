import Head from 'next/head';
import React from 'react';

import Cart from '../../components/Cart';
import PageWrapper from '../../components/PageWrapper';

export const CartPage: React.FC = () => {
    return (
        <PageWrapper>
            <Head>
                <title>Cart - King of Cardboard</title>
                <meta property="og:title" content="Cart - King of Cardboard" key="title" />
            </Head>
            <Cart />
        </PageWrapper>
    );
};

export default CartPage;
