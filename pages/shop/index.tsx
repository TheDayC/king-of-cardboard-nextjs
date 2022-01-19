import Head from 'next/head';
import React from 'react';

import PageWrapper from '../../components/PageWrapper';
import Shop from '../../components/Shop';

export const ShopPage: React.FC = () => (
    <PageWrapper>
        <Head>
            <title>Shop - King of Cardboard</title>
            <meta property="og:title" content="Shop - King of Cardboard" key="title" />
        </Head>
        <Shop category={null} />
    </PageWrapper>
);

export default ShopPage;
