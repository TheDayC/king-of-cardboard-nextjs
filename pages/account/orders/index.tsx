import React, { useState, useCallback } from 'react';
import { GetServerSideProps } from 'next';
import { unstable_getServerSession } from 'next-auth';
import Link from 'next/link';
import { MdAddCircleOutline } from 'react-icons/md';

import AccountWrapper from '../../../components/AccountWrapper';
import { authOptions } from '../../api/auth/[...nextauth]';
import { parseAsRole, parseAsString, safelyParse } from '../../../utils/parsers';
import { Roles } from '../../../enums/auth';
import OrderComponent from '../../../components/Account/Order';
import Loading from '../../../components/Loading';
import Pagination from '../../../components/Pagination';
import { listOrders } from '../../../utils/account/order';
import { isListOrders } from '../../../utils/typeguards';
import { Order } from '../../../types/orders';
import { useSession } from 'next-auth/react';

const LIMIT = 10;
const PAGE = 0;

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
    const session = await unstable_getServerSession(req, res, authOptions);
    const role = safelyParse(session, 'user.role', parseAsRole, Roles.User);
    const userId = safelyParse(session, 'user.id', parseAsString, null);
    const isAdmin = role === Roles.Admin;

    if (!session || !isAdmin || !userId) {
        return {
            redirect: {
                permanent: false,
                destination: '/login',
            },
        };
    }

    const ordersList = await listOrders(userId, LIMIT, PAGE, true, isAdmin);

    if (!isListOrders(ordersList)) {
        return {
            props: {
                initialOrders: [],
                initialTotalProducts: 0,
            },
        };
    }

    return {
        props: {
            initialOrders: ordersList.orders,
            initialTotalProducts: ordersList.count,
        },
    };
};

interface OrdersPageProps {
    initialOrders: Order[];
    initialTotalProducts: number;
}

export const OrdersPage: React.FC<OrdersPageProps> = ({ initialOrders, initialTotalProducts }) => {
    const { data: session } = useSession();
    const [orders, setOrders] = useState<Order[]>(initialOrders);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [count, setCount] = useState(LIMIT);
    const [page, setPage] = useState(PAGE);
    const [totalProducts, setTotalProducts] = useState(initialTotalProducts);
    const [isLoading, setIsLoading] = useState(false);
    const pageCount = totalProducts / LIMIT;
    const userId = safelyParse(session, 'user.id', parseAsString, null);
    const role = safelyParse(session, 'user.role', parseAsRole, Roles.User);
    const isAdmin = role === Roles.Admin;

    const handleUpdateProducts = useCallback(async () => {
        if (!userId || !isAdmin) return;

        setIsLoading(true);
        const ordersList = await listOrders(userId, LIMIT, PAGE, true, isAdmin);

        if (isListOrders(ordersList)) {
            setOrders(ordersList.orders);
            setTotalProducts(ordersList.count);
        }

        setIsLoading(false);
    }, [count, page, setIsLoading]);

    const handlePageNumber = (nextPage: number) => {
        setPage(nextPage);
        handleUpdateProducts();
    };

    return (
        <AccountWrapper title="Orders - Account - King of Cardboard" description="Account page">
            <div className="flex flex-col w-full justify-start items-start p-2 md:p-4 md:p-8 md:flex-row relative">
                {isLoading && <Loading show />}
                <div className="flex flex-col relative w-full space-y-4" data-testid="content">
                    <div className="flex flex-row justify-between items-center mb-4 pb-4 border-b border-solid border-gray-300">
                        <h1 className="text-5xl">Orders</h1>
                        <Link href="/account/orders/add" passHref>
                            <button className="btn btn-secondary rounded-md shadow-md">
                                <MdAddCircleOutline className="inline-block text-xl mr-2" />
                                Add order
                            </button>
                        </Link>
                    </div>
                    {orders.length > 0 &&
                        orders.map((order) => <OrderComponent order={order} key={`order-${order._id}`} />)}
                    {pageCount > 1 && (
                        <Pagination currentPage={page - 1} pageCount={pageCount} handlePageNumber={handlePageNumber} />
                    )}
                </div>
            </div>
        </AccountWrapper>
    );
};

export default OrdersPage;
