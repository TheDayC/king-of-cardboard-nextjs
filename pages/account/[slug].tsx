import React from 'react';
import Error from 'next/error';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';

import AccountMenu from '../../components/Account/Menu';
import Account from '../../components/Account';
import selector from './slugSelector';
import Content from '../../components/Content';
import { parseAsArrayOfDocuments, parseAsSlug, parseAsString, safelyParse } from '../../utils/parsers';
import PageWrapper from '../../components/PageWrapper';

export const getServerSideProps: GetServerSideProps = async (context) => {
    const session = await getSession(context);
    const slug = safelyParse(context, 'query.slug', parseAsSlug, null);

    const errorCode = slug ? false : 404;

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
        props: { errorCode },
    };
};

interface AccountSubPageProps {
    errorCode: number | boolean;
}

export const AccountSubPage: React.FC<AccountSubPageProps> = ({ errorCode }) => {
    const { pages } = useSelector(selector);
    const router = useRouter();
    const slug = safelyParse(router, 'query.slug', parseAsString, '');
    const page = pages.find((page) => page.title.toLowerCase() === slug);
    const content = safelyParse(page, 'content.json.content', parseAsArrayOfDocuments, null);

    // Show error page if a code is provided.
    if (errorCode && typeof errorCode === 'number') {
        return <Error statusCode={errorCode} />;
    }

    return (
        <PageWrapper>
            <div className="flex flex-col md:flex-row w-full justify-start items-start">
                <div className="hidden md:block">
                    <AccountMenu isDropdown={false} />
                </div>
                <div className="dropdown w-full p-2 md:hidden">
                    <div tabIndex={0} className="btn btn-block">
                        Account Menu
                    </div>
                    <AccountMenu isDropdown />
                </div>
                <div className="flex flex-col relative w-full px-2 py-0 md:w-3/4 md:px-4 md md:px-8">
                    {content && <Content content={content} />}
                    <Account slug={slug} />
                </div>
            </div>
        </PageWrapper>
    );
};

export default AccountSubPage;
