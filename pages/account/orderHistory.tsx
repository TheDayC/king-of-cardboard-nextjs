import React from 'react';
import { get } from 'lodash';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { getSession } from 'next-auth/react';

import AccountMenu from '../../components/Account/Menu';
import Header from '../../components/Header';
import { ServerSideRedirectProps } from '../../types/pages';
import selector from './slugSelector';
import Content from '../../components/Content';
import OrderHistory from '../../components/Account/OrderHistory';
import { parseAsString, safelyParse } from '../../utils/parsers';
import { getOrders } from '../../utils/account';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
export async function getServerSideProps(context: any): Promise<ServerSideRedirectProps | object> {
    console.log('🚀 ~ file: orderHistory.tsx ~ line 18 ~ getServerSideProps ~ context', context);
    const session = await getSession(context);
    const emailAddress = safelyParse(session, 'user.email', parseAsString, '');
    // const orders = await getOrders();

    // If we're signed in then decide whether we should show the page or 404.
    return {
        props: {},
    };
}

interface AccountSubPageProps {
    errorCode: number | boolean;
}

export const OrderHistoryPage: React.FC<AccountSubPageProps> = ({ errorCode }) => {
    console.log('🚀 ~ file: orderHistory.tsx ~ line 30 ~ errorCode', errorCode);
    const { pages } = useSelector(selector);
    const router = useRouter();
    const slug: string = get(router, 'query.slug', '');
    const page = pages.find((page) => page.title.toLowerCase() === slug);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const content: any[] | null = get(page, 'content.json.content', null);

    return (
        <React.Fragment>
            <Header />
            <div className="flex p-4 relative">
                <div className="container mx-auto">
                    <div className="flex flex-row w-full justify-start items-start">
                        <div className="w-1/4">
                            <AccountMenu />
                        </div>
                        <div className="flex flex-col py-4 px-8 w-3/4">
                            {content && <Content content={content} />}
                            <OrderHistory />
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
};

export default OrderHistoryPage;
