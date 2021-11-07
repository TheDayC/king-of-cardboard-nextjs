import React from 'react';
import { useRouter } from 'next/router';
import { getSession, useSession } from 'next-auth/react';

import AccountMenu from '../../components/AccountMenu';
import Header from '../../components/Header';
import { ServerSideRedirectProps } from '../../types/pages';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
export async function getServerSideProps(context: any): Promise<ServerSideRedirectProps | object> {
    const session = await getSession(context);

    if (!session) {
        return {
            redirect: {
                permanent: false,
                destination: '/login',
            },
        };
    }

    return { props: {} };
}

export const AccountPage: React.FC = () => {
    const { data: session, status } = useSession();
    const router = useRouter();

    return (
        <React.Fragment>
            <Header />
            <div className="flex p-4 relative">
                <div className="container mx-auto">
                    <div className="flex flex-row w-full justify-start items-start">
                        <AccountMenu />
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
};

export default AccountPage;
