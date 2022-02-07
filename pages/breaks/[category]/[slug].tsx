import React from 'react';
import Head from 'next/head';
import { GetServerSideProps } from 'next';

import Break from '../../../components/Break';
import { parseAsString, safelyParse } from '../../../utils/parsers';
import PageWrapper from '../../../components/PageWrapper';
import { toTitleCase } from '../../../utils';
import { getBreakStatus } from '../../../utils/breaks';
import Custom404Page from '../../404';

export const getServerSideProps: GetServerSideProps = async (context) => {
    const slug = safelyParse(context, 'query.slug', parseAsString, null);
    const prettySlug = slug ? toTitleCase(slug.replaceAll('-', ' ')) : '';
    const { isLive, isComplete } = await getBreakStatus(slug);

    // Is we're live or complete then perma redirect the break's page.
    if (isLive || isComplete) {
        return {
            redirect: {
                permanent: true,
                destination: '/breaks',
            },
        };
    }

    return {
        props: {
            errorCode: !slug ? 404 : null,
            slug,
            prettySlug,
            isLive,
            isComplete,
        },
    };
};

interface BreakPageProps {
    errorCode: number | null;
    slug: string | null;
    prettySlug: string;
    isLive: boolean;
    isComplete: boolean;
}

export const BreakPage: React.FC<BreakPageProps> = ({ errorCode, slug, prettySlug, isLive, isComplete }) => {
    // Show error page if a code is provided.
    if (errorCode || isLive || isComplete) {
        return <Custom404Page />;
    }

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
