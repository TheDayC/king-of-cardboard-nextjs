import React from 'react';
import { GetServerSideProps } from 'next';
import { Document } from '@contentful/rich-text-types';

import PageWrapper from '../../components/PageWrapper';
import { parseAsString, safelyParse } from '../../utils/parsers';
import Custom404Page from '../404';
import { getPageBySlug } from '../../utils/pages';
import Content from '../../components/Content';
import { toTitleCase } from '../../utils';

export const getServerSideProps: GetServerSideProps = async (context) => {
    // Shutting up shop.
    return {
        redirect: {
            permanent: true,
            destination: '/',
        },
    };

    const slug = safelyParse(context, 'query.slug', parseAsString, null);

    const { content } = await getPageBySlug(slug, 'information/');

    return {
        props: {
            errorCode: !slug || !content ? 404 : null,
            content,
            slug,
        },
    };
};

interface InformationPageProps {
    errorCode: number | null;
    content: Document | null;
    slug: string | null;
}

export const InformationPage: React.FC<InformationPageProps> = ({ errorCode, content, slug }) => {
    const prettySlug = slug ? toTitleCase(slug.replaceAll('-', ' ')) : '';

    // Show error page if a code is provided.
    if (errorCode || !content) {
        return <Custom404Page />;
    }

    return (
        <PageWrapper
            title={`${prettySlug} - Information - King of Cardboard`}
            description="Information regarding King of Cardboard and our products."
        >
            <Content content={[content]} />
        </PageWrapper>
    );
};

export default InformationPage;
