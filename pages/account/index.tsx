import React from 'react';
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import { Document } from '@contentful/rich-text-types';

import Content from '../../components/Content';
import PageWrapper from '../../components/PageWrapper';
import { getPageBySlug } from '../../utils/pages';
import Custom404Page from '../404';

export const getServerSideProps: GetServerSideProps = async (context) => {
    const session = await getSession(context);
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
        <PageWrapper title="Account - King of Cardboard" description="Account page">
            <div className="flex flex-col md:flex-row w-full justify-start items-start">
                <div className="flex flex-col relative w-full px-2 py-0 md:w-3/4 md:px-4 md:px-8" data-testid="content">
                    {content && <Content content={[content]} />}
                </div>
            </div>
        </PageWrapper>
    );
};

export default AccountPage;
