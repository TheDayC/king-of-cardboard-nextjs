import React from 'react';
import Head from 'next/head';

import PageWrapper from '../components/PageWrapper';
import Error404 from '../components/404';

export const Custom404Page: React.FC = () => (
    <PageWrapper>
        <Head>
            <title>404 - King of Cardboard</title>
            <meta property="og:title" content="404 - King of Cardboard" key="title" />
        </Head>
        <Error404 />
    </PageWrapper>
);

export default Custom404Page;
