import React from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

import Shop from '../../components/Shop';
import PageWrapper from '../../components/PageWrapper';
import { parseAsString, safelyParse } from '../../utils/parsers';

export const Category: React.FC = () => {
    const router = useRouter();
    const category = safelyParse(router, 'query.cat', parseAsString, null);

    return (
        <PageWrapper>
            <Head>
                <title>{category} - Shop - King of Cardboard</title>
                <meta property="og:title" content={`${category} - Shop - King of Cardboard`} key="title" />
            </Head>
            <Shop category={category} />
        </PageWrapper>
    );
};

export default Category;
