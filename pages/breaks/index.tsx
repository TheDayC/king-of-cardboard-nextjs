import Head from 'next/head';
import React from 'react';

import Breaks from '../../components/Breaks';
import PageWrapper from '../../components/PageWrapper';

export const BreakPage: React.FC = () => {
    return (
        <PageWrapper>
            <Head>
                <title>Breaks - King of Cardboard</title>
                <meta property="og:title" content="Breaks - King of Cardboard" key="title" />
            </Head>
            <Breaks />
        </PageWrapper>
    );
};

export default BreakPage;
