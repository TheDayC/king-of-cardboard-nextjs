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
                orders: [],
                count: 0,
            },
        };
    }

    // If we're signed in then decide whether we should show the page or 404.
    return {
        props: {
            initialOrders: orderList.orders,
            initialCount: orderList.count,
        },
    };
};

interface OrderHistoryPageProps {
    initialOrders: Order[];
    initialCount: number;
}

export const OrderHistoryPage: React.FC<OrderHistoryPageProps> = ({ initialOrders, initialCount }) => {
    const dispatch = useDispatch();
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
            <div className="flex flex-col relative w-full p-4">
                {orders.length > 0 ? (
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
                {totalPageCount > 1 && orders.length > 0 && (
                    <Pagination currentPage={page} pageCount={totalPageCount} handlePageNumber={handlePageNumber} />
                )}
            </div>
        </AccountWrapper>
    );
};

export default OrderHistoryPage;
