import React from 'react';
import { useSelector } from 'react-redux';
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';

import AccountMenu from '../../components/Account/Menu';
import selector from './selector';
import Content from '../../components/Content';
import { parseAsArrayOfContentJSON, safelyParse } from '../../utils/parsers';
import PageWrapper from '../../components/PageWrapper';

export const getServerSideProps: GetServerSideProps = async (context) => {
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
};

export const AccountPage: React.FC = () => {
    const { page } = useSelector(selector);
    const content = safelyParse(page, 'content.json.content', parseAsArrayOfContentJSON, null);

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
                <div className="flex flex-col relative w-full px-2 py-0 md:w-3/4 md:px-4 md:px-8">
                    {content && <Content content={content} />}
                </div>
            </div>
        </PageWrapper>
    );
};

export default AccountPage;
