import React, { useState } from 'react';
import { GetServerSideProps } from 'next';
import { unstable_getServerSession } from 'next-auth';
import Image from 'next/image';

import { parseAsString, safelyParse } from '../../../utils/parsers';
import { authOptions } from '../../api/auth/[...nextauth]';
import { isListOrders } from '../../../utils/typeguards';
import { listOrders } from '../../../utils/order';
import { Order } from '../../../types/orders';
import { getPrettyPrice } from '../../../utils/account/products';
import ShortOrder from '../../../components/Account/OrderHistory/ShortOrder';
import Pagination from '../../../components/Pagination';
import { useDispatch } from 'react-redux';
import { useSession } from 'next-auth/react';
import { fetchOrders, setIsLoadingOrders } from '../../../store/slices/account';
import AccountWrapper from '../../../components/AccountWrapper';
import crown from '../../../images/large-crown.png';

const SIZE = 10;
const PAGE = 10;

export const getServerSideProps: GetServerSideProps = async ({ req, res, query }) => {
    const session = await unstable_getServerSession(req, res, authOptions);

    // If session hasn't been established redirect to the login page.
    if (!session) {
        return {
            redirect: {
                permanent: false,
                destination: '/login',
            },
        };
    }

    const userId = safelyParse(session, 'user.id', parseAsString, '');
    const orderNumber = safelyParse(query, 'orderNumber', parseAsString, '0');
    const orderList = await listOrders(userId, SIZE, PAGE);

    if (!orderNumber || !userId) {
        return {
            redirect: {
                permanent: false,
                destination: '/account/order-history',
            },
        };
    }

    if (!isListOrders(orderList)) {
        return {
            props: {
                orders: [],
                count: 0,
            },
        };
    }

    // If we're signed in then decide whether we should show the page or 404.
    return {
        props: {
            orders: orderList.orders,
            count: orderList.count,
        },
    };
};

interface OrderHistoryPageProps {
    orders: Order[];
    count: number;
}

export const OrderHistoryPage: React.FC<OrderHistoryPageProps> = ({ orders, count }) => {
    const dispatch = useDispatch();
    const { data: session } = useSession();
    const [currentPage, setCurrentPage] = useState(1);
    const userId = safelyParse(session, 'user.id', parseAsString, null);
    const hasOrders = orders.length > 0;

    const handlePageNumber = (nextPage: number) => {
        if (userId) {
            const page = nextPage + 1;

            dispatch(setIsLoadingOrders(true));
            dispatch(fetchOrders({ userId, size: SIZE, page }));
            setCurrentPage(page);
        }
    };

    return (
        <AccountWrapper title="Order History - Account - King of Cardboard" description="Your order history">
            <div className="flex flex-col relative w-full px-2 py-0 md:px-4 md:px-8">
                {hasOrders ? (
                    orders.map((order, i) => {
                        return (
                            <ShortOrder
                                orderNumber={order.orderNumber}
                                orderStatus={order.orderStatus}
                                paymentStatus={order.paymentStatus}
                                fulfillmentStatus={order.fulfillmentStatus}
                                itemCount={order.items.length}
                                total={getPrettyPrice(order.total)}
                                created={order.created}
                                lastUpdated={order.lastUpdated}
                                lineItems={order.items}
                                key={`order-${i}`}
                            />
                        );
                    })
                ) : (
                    <div className="flex flex-col relative w-full p-4 space-y-6">
                        <h1 className="text-3xl">Order History</h1>
                        <div className="flex flex-col items-center w-full space-y-6">
                            <Image
                                src={crown}
                                alt="King of Cardboard Crown"
                                title="King of Cardboard Crown"
                                width={300}
                                height={300}
                            />
                            <p className="text-xl">There's nothing here...</p>
                            <p className="text-xl">Place an order to popular your order history!</p>
                        </div>
                    </div>
                )}
                {count > 1 && hasOrders && (
                    <Pagination
                        currentPage={currentPage - 1}
                        pageCount={count / 10}
                        handlePageNumber={handlePageNumber}
                    />
                )}
            </div>
        </AccountWrapper>
    );
};

export default OrderHistoryPage;
