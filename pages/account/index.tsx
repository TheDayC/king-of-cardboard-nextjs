import React from 'react';
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import { Document } from '@contentful/rich-text-types';
import Head from 'next/head';

import AccountMenu from '../../components/Account/Menu';
import Content from '../../components/Content';
import PageWrapper from '../../components/PageWrapper';
import { pageBySlug } from '../../utils/pages';
import Custom404Page from '../404';

export const getServerSideProps: GetServerSideProps = async (context) => {
    const session = await getSession(context);
    const content = await pageBySlug('account', '');

    if (!session) {
        return {
            redirect: {
                permanent: false,
                destination: '/login',
            },
        };
    }

    return {
        props: {
            content,
        },
    };
};

interface AccountPageProps {
    content: Document[] | null;
}

export const AccountPage: React.FC<AccountPageProps> = ({ content }) => {
    if (!content) {
        return <Custom404Page />;
    }

    return (
        <PageWrapper>
            <Head>
                <title>Account - King of Cardboard</title>
                <meta property="og:title" content="Account - King of Cardboard" key="title" />
            </Head>
            <div className="flex flex-col md:flex-row w-full justify-start items-start">
                <div className="hidden md:block">
                    <AccountMenu isDropdown={false} />
                </div>
                <div className="dropdown w-full mb-4 md:hidden">
                    <div tabIndex={0} className="btn btn-block">
                        Account Menu
                    </div>
                    <AccountMenu isDropdown />
                </div>
                <div className="flex flex-col relative w-full px-2 py-0 md:w-3/4 md:px-4 md:px-8" data-testid="content">
                    {content && <Content content={content} />}
                </div>
            </div>
        </PageWrapper>
    );
};

export default AccountPage;
