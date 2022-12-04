import React from 'react';
import { GetServerSideProps } from 'next';
import { Document } from '@contentful/rich-text-types';
import { unstable_getServerSession } from 'next-auth';

import Content from '../../components/Content';
import { getPageBySlug } from '../../utils/pages';
import Custom404Page from '../404';
import AccountWrapper from '../../components/AccountWrapper';
import { authOptions } from '../api/auth/[...nextauth]';

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
    const session = await unstable_getServerSession(req, res, authOptions);
    const { content } = await getPageBySlug('account', '');

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
    content: Document | null;
}

export const AccountPage: React.FC<AccountPageProps> = ({ content }) => {
    if (!content) {
        return <Custom404Page />;
    }

    return (
        <AccountWrapper title="Account - King of Cardboard" description="Account page">
            <div className="flex flex-col w-full justify-start items-start p-2 md:p-4 md:p-8 md:flex-row">
                <div className="flex flex-col relative w-full " data-testid="content">
                    {content && <Content content={[content]} />}
                </div>
            </div>
        </AccountWrapper>
    );
};

export default AccountPage;
