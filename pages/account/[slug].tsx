import React from 'react';
import { getSession } from 'next-auth/react';
import { get } from 'lodash';
import Error from 'next/error';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';

import AccountMenu from '../../components/Account/Menu';
import Header from '../../components/Header';
import { ServerSideRedirectProps } from '../../types/pages';
import Account from '../../components/Account';
import selector from './slugSelector';
import Content from '../../components/Content';
import { parseAsSlug, safelyParse } from '../../utils/parsers';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
export async function getServerSideProps(context: any): Promise<ServerSideRedirectProps | object> {
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
}

interface AccountSubPageProps {
    errorCode: number | boolean;
}

export const AccountSubPage: React.FC<AccountSubPageProps> = ({ errorCode }) => {
    const { pages } = useSelector(selector);
    const router = useRouter();
    const slug: string = get(router, 'query.slug', '');
    const page = pages.find((page) => page.title.toLowerCase() === slug);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const content: any[] | null = get(page, 'content.json.content', null);

    // Show error page if a code is provided.
    if (errorCode && typeof errorCode === 'number') {
        return <Error statusCode={errorCode} />;
    }

    return (
        <React.Fragment>
            <Header />
            <div className="flex p-0 md:p-4 relative">
                <div className="container mx-auto">
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
                        <div className="flex flex-col relative w-full py-2 px-6 md:w-3/4 md:py-4 md:px-8">
                            {content && <Content content={content} />}
                            <Account slug={slug} />
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
};

export default AccountSubPage;
