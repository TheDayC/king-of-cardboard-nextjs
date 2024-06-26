import React from 'react';
import { GetServerSideProps } from 'next';
import { getProviders, LiteralUnion, ClientSafeProvider } from 'next-auth/react';
import { Document } from '@contentful/rich-text-types';
import { BuiltInProviderType } from 'next-auth/providers';
import { unstable_getServerSession } from 'next-auth';

import Account from '../../components/Account';
import Content from '../../components/Content';
import { parseAsSlug, safelyParse } from '../../utils/parsers';
import AccountWrapper from '../../components/AccountWrapper';
import { getPageBySlug } from '../../utils/pages';
import Custom404Page from '../404';
import { toTitleCase } from '../../utils';
import { authOptions } from '../api/auth/[...nextauth]';

export const getServerSideProps: GetServerSideProps = async ({ req, res, query }) => {
    const session = await unstable_getServerSession(req, res, authOptions);
    const slug = safelyParse(query, 'slug', parseAsSlug, null);
    const providers = await getProviders();
    const { content } = await getPageBySlug(slug, 'account/');
    const should404 = !slug || !content;

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
            errorCode: should404 ? 404 : null,
            slug,
            content,
            providers,
        },
    };
};

interface AccountSubPageProps {
    errorCode: number | null;
    slug: string | null;
    content: Document | null;
    providers: Record<LiteralUnion<BuiltInProviderType, string>, ClientSafeProvider> | null;
}

export const AccountSubPage: React.FC<AccountSubPageProps> = ({ errorCode, slug, content, providers }) => {
    const prettySlug = slug ? toTitleCase(slug.replaceAll('-', ' ')) : '';

    if (errorCode || !content || !slug || !providers) {
        return <Custom404Page />;
    }

    return (
        <AccountWrapper title={`${prettySlug} - Account - King of Cardboard`} description="Account page">
            <div className="flex flex-col md:flex-row w-full justify-start items-start p-2 md:p-4 md:p-8">
                <div className="flex flex-col relative w-full">
                    <Content content={[content]} />
                    <Account slug={slug} />
                </div>
            </div>
        </AccountWrapper>
    );
};

export default AccountSubPage;
