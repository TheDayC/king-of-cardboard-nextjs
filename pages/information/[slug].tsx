import React from 'react';
import { GetServerSideProps } from 'next';
import { Document } from '@contentful/rich-text-types';

import PageWrapper from '../../components/PageWrapper';
import { parseAsString, safelyParse } from '../../utils/parsers';
import Custom404Page from '../404';
import { pageBySlug } from '../../utils/pages';
import Content from '../../components/Content';
import { toTitleCase } from '../../utils';

export const getServerSideProps: GetServerSideProps = async (context) => {
    const slug = safelyParse(context, 'query.slug', parseAsString, null);

    const content = await pageBySlug(slug, 'information/');

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
    content: Document[] | null;
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
            description="We can't seem to find the page you requested!"
        >
            <Content content={content} />
        </PageWrapper>
    );
};

export default InformationPage;
