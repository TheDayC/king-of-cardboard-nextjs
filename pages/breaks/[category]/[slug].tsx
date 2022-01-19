import React from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

import Break from '../../../components/Break';
import { parseAsString, safelyParse } from '../../../utils/parsers';
import PageWrapper from '../../../components/PageWrapper';
import { toTitleCase } from '../../../utils';

export const BreakPage: React.FC = () => {
    const router = useRouter();
    const slug = safelyParse(router, 'query.slug', parseAsString, null);
    const prettySlug = slug ? toTitleCase(slug.replaceAll('-', ' ')) : '';

    return (
        <PageWrapper>
            <Head>
                <title>{prettySlug} - Breaks - King of Cardboard</title>
                <meta property="og:title" content={`${prettySlug} - Breaks - King of Cardboard`} key="title" />
            </Head>
            {slug && <Break slug={slug} />}
        </PageWrapper>
    );
};

export default BreakPage;
