import React from 'react';
import { GetServerSideProps } from 'next';
import { Document } from '@contentful/rich-text-types';

import PageWrapper from '../../components/PageWrapper';
import { parseAsString, safelyParse } from '../../utils/parsers';
import Custom404Page from '../404';
import { pageBySlug } from '../../utils/pages';
import Content from '../../components/Content';

export const getServerSideProps: GetServerSideProps = async (context) => {
    const slug = safelyParse(context, 'query.slug', parseAsString, null);

    const content = await pageBySlug(slug, 'customer-service/');

    return {
        props: {
            errorCode: !slug || !content ? 404 : null,
            content,
        },
    };
};

interface CustomerServicePageProps {
    errorCode: number | null;
    content: Document[] | null;
}

export const CustomerServicePage: React.FC<CustomerServicePageProps> = ({ errorCode, content }) => {
    // Show error page if a code is provided.
    if (errorCode || !content) {
        return <Custom404Page />;
    }

    return (
        <PageWrapper>
            <Content content={content} />
        </PageWrapper>
    );
};

export default CustomerServicePage;
