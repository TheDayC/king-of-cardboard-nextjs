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
    const slug = safelyParse(context, 'query.slug', parseAsString, null);
    const { content } = await getPageBySlug(slug, 'customer-service/');
    const should404 = !slug || !content;

    return {
        props: {
            errorCode: should404 ? 404 : null,
            content,
            slug,
        },
    };
};

interface CustomerServicePageProps {
    errorCode: number | null;
    content: Document | null;
    slug: string | null;
}

export const CustomerServicePage: React.FC<CustomerServicePageProps> = ({ errorCode, content, slug }) => {
    const prettySlug = slug ? toTitleCase(slug.replaceAll('-', ' ')) : '';

    // Show error page if a code is provided.
    if (errorCode || !content) {
        return <Custom404Page />;
    }

    return (
        <PageWrapper
            title={`${prettySlug} - Customer Service - King of Cardboard`}
            description="Customer service information for King of Cardboard."
        >
            <Content content={[content]} />
        </PageWrapper>
    );
};

export default CustomerServicePage;
