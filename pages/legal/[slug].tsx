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

    const { title, content } = await pageBySlug(slug, 'legal/');

    return {
        props: {
            errorCode: !slug || !content ? 404 : null,
            title,
            content,
        },
    };
};

interface GeneralPageProps {
    errorCode: number | null;
    title: string | null;
    content: Document[] | null;
}

export const GeneralPage: React.FC<GeneralPageProps> = ({ errorCode, title, content }) => {
    // Show error page if a code is provided.
    if (errorCode) {
        return <Custom404Page />;
    }

    return (
        <PageWrapper>
            {title && (
                <h1 className="text-5xl mb-6" role="heading" data-testid="h1">
                    {title}
                </h1>
            )}
            {content && <Content content={content} />}
        </PageWrapper>
    );
};

export default GeneralPage;
