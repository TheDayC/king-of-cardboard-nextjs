import React from 'react';
import { getSession } from 'next-auth/react';
import { useSelector } from 'react-redux';

import AccountMenu from '../../components/Account/Menu';
import Header from '../../components/Header';
import { ServerSideRedirectProps } from '../../types/pages';
import selector from './selector';
import Content from '../../components/Content';
import { parseAsArrayOfContentJSON, safelyParse } from '../../utils/parsers';

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
    const content = safelyParse(page, 'content.json.content', parseAsArrayOfContentJSON, null);

    return (
        <React.Fragment>
            <Header />
            <div className="flex p-0 md:p-4 relative">
                <div className="container mx-auto">
                    <div className="flex flex-col md:flex-row w-full justify-start items-start">
                        <div className="w-full md:w-1/4">
                            <div className="hidden md:block">
                                <AccountMenu isDropdown={false} />
                            </div>
                            <div className="dropdown w-full p-2 md:hidden">
                                <div tabIndex={0} className="btn btn-block">
                                    Account Menu
                                </div>
                                <AccountMenu isDropdown />
                            </div>
                        </div>
                        <div className="flex flex-col py-4 px-8 w-full md:w-3/4">
                            {content && <Content content={content} />}
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
};

export default AccountPage;
