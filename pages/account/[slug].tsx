import React from 'react';
import { getSession, useSession } from 'next-auth/react';
import { get } from 'lodash';
import Error from 'next/error';

import AccountMenu from '../../components/Account/Menu';
import Header from '../../components/Header';
import { ServerSideRedirectProps } from '../../types/pages';
import Account from '../../components/Account';

const slugs = ['details', 'profile', 'orderHistory', 'achievements'];

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
export async function getServerSideProps(context: any): Promise<ServerSideRedirectProps | object> {
    const session = await getSession(context);
    const slug: string = get(context, 'query.slug', '');

    const errorCode = slugs.includes(slug) ? false : 404;

    if (!session) {
        return {
            redirect: {
                permanent: false,
                destination: '/login',
            },
        };
    }

    return {
        props: { errorCode },
    };
}

interface AccountSubPageProps {
    errorCode: number | boolean;
}

export const AccountSubPage: React.FC<AccountSubPageProps> = ({ errorCode }) => {
    if (errorCode && typeof errorCode === 'number') {
        return <Error statusCode={errorCode} />;
    }

    const { data: session, status } = useSession();

    return (
        <React.Fragment>
            <Header />
            <div className="flex p-4 relative">
                <div className="container mx-auto">
                    <div className="flex flex-row w-full justify-start items-start">
                        <AccountMenu />
                        <Account />
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
};

export default AccountSubPage;
