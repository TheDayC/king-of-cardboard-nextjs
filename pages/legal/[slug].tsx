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

    const content = await pageBySlug(slug, 'legal/');

    return {
        props: {
            errorCode: !slug || !content ? 404 : null,
            content,
        },
    };
};

interface LegalPageProps {
    errorCode: number | null;
    content: Document[] | null;
}

export const LegalPage: React.FC<LegalPageProps> = ({ errorCode, content }) => {
    if (errorCode || !content) {
        return <Custom404Page />;
    }

    return (
        <PageWrapper>
            <Content content={content} />
        </PageWrapper>
    );
};

export default LegalPage;
