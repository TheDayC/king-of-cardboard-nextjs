import React from 'react';
import { get } from 'lodash';
import { getSession, useSession } from 'next-auth/react';
import { useSelector } from 'react-redux';

import AccountMenu from '../../components/Account/Menu';
import Header from '../../components/Header';
import { ServerSideRedirectProps } from '../../types/pages';
import selector from './selector';
import Content from '../../components/Content';

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
    const { page } = useSelector(selector);
    const { data: session, status } = useSession();
    const content: any[] | null = get(page, 'content.json.content', null);
    console.log('🚀 ~ file: index.tsx ~ line 31 ~ content', content);

    return (
        <React.Fragment>
            <Header />
            <div className="flex p-4 relative">
                <div className="container mx-auto">
                    <div className="flex flex-row w-full justify-start items-start">
                        <div className="w-1/3">
                            <AccountMenu />
                        </div>
                        <div className="flex flex-col py-4 px-8">{content && <Content content={content} />}</div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
};

export default AccountPage;
