import React from 'react';
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import { Document } from '@contentful/rich-text-types';

import Account from '../../components/Account';
import Content from '../../components/Content';
import { parseAsSlug, safelyParse } from '../../utils/parsers';
import PageWrapper from '../../components/PageWrapper';
import { pageBySlug } from '../../utils/pages';
import Custom404Page from '../404';
import { toTitleCase } from '../../utils';

export const getServerSideProps: GetServerSideProps = async (context) => {
    const session = await getSession(context);
    const slug = safelyParse(context, 'query.slug', parseAsSlug, null);

    const content = await pageBySlug(slug, 'account/');

    // If session hasn't been established redirect to the login page.
    if (!session) {
        return {
            redirect: {
                permanent: false,
                destination: '/login',
            },
        };
    }

    // If we're signed in then decide whether we should show the page or 404.
    return {
        props: {
            errorCode: !slug || !content ? 404 : null,
            slug,
            content,
        },
    };
};

interface AccountSubPageProps {
    errorCode: number | null;
    slug: string | null;
    content: Document[] | null;
}

export const AccountSubPage: React.FC<AccountSubPageProps> = ({ errorCode, slug, content }) => {
    const prettySlug = slug ? toTitleCase(slug.replaceAll('-', ' ')) : '';

    if (errorCode || !content || !slug) {
        return <Custom404Page />;
    }

    return (
        <PageWrapper title={`${prettySlug} - Account - King of Cardboard`} description="Account page">
            <div className="flex flex-col md:flex-row w-full justify-start items-start">
                <div className="flex flex-col relative w-full px-2 py-0 md:px-4 md md:px-8">
                    <Content content={content} />
                    <Account slug={slug} />
                </div>
            </div>
        </PageWrapper>
    );
};

export default AccountSubPage;
