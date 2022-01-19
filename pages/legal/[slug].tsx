import React from 'react';
import { GetServerSideProps } from 'next';
import { Document } from '@contentful/rich-text-types';
import { useRouter } from 'next/router';
import Head from 'next/head';

import PageWrapper from '../../components/PageWrapper';
import { parseAsString, safelyParse } from '../../utils/parsers';
import Custom404Page from '../404';
import { pageBySlug } from '../../utils/pages';
import Content from '../../components/Content';
import { toTitleCase } from '../../utils';

export const getServerSideProps: GetServerSideProps = async (context) => {
    const slug = safelyParse(context, 'query.slug', parseAsString, null);

    const content = await pageBySlug(slug, 'legal/');

    return {
        props: {
            errorCode: !slug || !content ? 404 : null,
            content,
            slug,
        },
    };
};

interface LegalPageProps {
    errorCode: number | null;
    content: Document[] | null;
    slug: string | null;
}

export const LegalPage: React.FC<LegalPageProps> = ({ errorCode, content, slug }) => {
    const prettySlug = slug ? toTitleCase(slug.replaceAll('-', ' ')) : '';

    if (errorCode || !content) {
        return <Custom404Page />;
    }

    return (
        <PageWrapper>
            <Head>
                <title>{prettySlug} - Legal - King of Cardboard</title>
                <meta property="og:title" content={`${prettySlug} - Legal - King of Cardboard`} key="title" />
            </Head>
            <Content content={content} />
        </PageWrapper>
    );
};

export default LegalPage;
