import React, { useState } from 'react';
import { GetServerSideProps } from 'next';
import { unstable_getServerSession } from 'next-auth';
import Image from 'next/image';
import { useSession } from 'next-auth/react';

import { parseAsString, safelyParse } from '../../../utils/parsers';
import { authOptions } from '../../api/auth/[...nextauth]';
import { isListOrders } from '../../../utils/typeguards';
import { listOrders } from '../../../utils/account/order';
import { Order } from '../../../types/orders';
import { getPrettyPrice } from '../../../utils/account/products';
import ShortOrder from '../../../components/Account/OrderHistory/ShortOrder';
import Pagination from '../../../components/Pagination';
import AccountWrapper from '../../../components/AccountWrapper';
import crown from '../../../images/large-crown.png';
import Loading from '../../../components/Loading';
import { ResponseError } from '../../../types/errors';

const SIZE = 5;
const PAGE = 0;

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
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

    if (!userId) {
        return {
            redirect: {
                permanent: false,
                destination: '/account/order-history',
            },
        };
    }

    const orderList = await listOrders(userId, SIZE, PAGE, true);

    if (!isListOrders(orderList)) {
        return {
            props: {
                initialOrders: [],
                initialCount: 0,
                error: orderList,
            },
        };
    }

    // If we're signed in then decide whether we should show the page or 404.
    return {
        props: {
            initialOrders: orderList.orders || [],
            initialCount: orderList.count || 0,
        },
    };
};

interface OrderHistoryPageProps {
    initialOrders: Order[];
    initialCount: number;
    error?: ResponseError;
}

export const OrderHistoryPage: React.FC<OrderHistoryPageProps> = ({ initialOrders, initialCount, error }) => {
    console.log('🚀 ~ file: index.tsx:75 ~ error', error);
    console.log('🚀 ~ file: index.tsx:72 ~ initialOrders', initialOrders);
    const { data: session } = useSession();
    const [orders, setOrders] = useState<Order[]>(initialOrders);
    const [totalOrders, setTotalOrders] = useState(initialCount);
    const [page, setPage] = useState(PAGE);
    const [isLoading, setIsLoading] = useState(false);
    const userId = safelyParse(session, 'user.id', parseAsString, null);
    const totalPageCount = totalOrders / SIZE;

    const handlePageNumber = async (nextPage: number) => {
        setPage(nextPage);

        if (!userId) return;
        setIsLoading(true);
        const orderList = await listOrders(userId, SIZE, SIZE * nextPage);

        if (isListOrders(orderList)) {
            setOrders(orderList.orders);
            setTotalOrders(orderList.count);
        }

        setIsLoading(false);
    };

    return (
        <AccountWrapper title="Order History - Account - King of Cardboard" description="Your order history">
            <div className="flex flex-col relative w-full py-4 px-6">
                <Loading show={isLoading} />
                {orders.length > 0 ? (
                    <div className="flex flex-col relative w-full p-4 space-y-6">
                        <h1 className="text-5xl">Order History</h1>
                        <div className="flex flex-col items-start w-full space-y-6">
                            {orders.map((order, i) => {
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
                            })}
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col relative w-full p-4 space-y-6">
                        <h1 className="text-5xl">Order History</h1>
                        <div className="flex flex-col items-center w-full space-y-6">
                            <Image
                                src={crown}
                                alt="King of Cardboard Crown"
                                title="King of Cardboard Crown"
                                width={300}
                                height={300}
                            />
                            <p className="text-xl">There is nothing here...</p>
                            <p className="text-xl">Place an order to popular your order history!</p>
                        </div>
                    </div>
                )}
                {totalPageCount > 1 && orders.length > 0 && (
                    <Pagination currentPage={page} pageCount={totalPageCount} handlePageNumber={handlePageNumber} />
                )}
            </div>
        </AccountWrapper>
    );
};

export default OrderHistoryPage;
