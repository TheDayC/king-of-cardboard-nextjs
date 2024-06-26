import React, { useState } from 'react';
import { GetServerSideProps } from 'next';
import { unstable_getServerSession } from 'next-auth';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { MdAddCircleOutline } from 'react-icons/md';

import AccountWrapper from '../../../components/AccountWrapper';
import { authOptions } from '../../api/auth/[...nextauth]';
import { parseAsRole, parseAsString, safelyParse } from '../../../utils/parsers';
import { Roles } from '../../../enums/auth';
import OrderComponent from '../../../components/Account/Order';
import Loading from '../../../components/Loading';
import Pagination from '../../../components/Pagination';
import { listAllOrders } from '../../../utils/account/order';
import { isListOrders } from '../../../utils/typeguards';
import { Order } from '../../../types/orders';
import SearchBar from '../../../components/Account/Fields/SearchBar';

const LIMIT = 8;
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

    const ordersList = await listAllOrders(LIMIT, PAGE, '', true);

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
    const [currentTerm, setCurrentTerm] = useState('');
    const [page, setPage] = useState(PAGE);
    const [totalProducts, setTotalProducts] = useState(initialTotalProducts);
    const [isLoading, setIsLoading] = useState(false);
    const pageCount = totalProducts / LIMIT;
    const userId = safelyParse(session, 'user.id', parseAsString, null);
    const role = safelyParse(session, 'user.role', parseAsRole, Roles.User);
    const isAdmin = role === Roles.Admin;

    const handleUpdateProducts = async (nextPage: number) => {
        if (!userId || !isAdmin) return;

        setIsLoading(true);
        const ordersList = await listAllOrders(LIMIT, LIMIT * nextPage, currentTerm, false);

        if (isListOrders(ordersList)) {
            setOrders(ordersList.orders);
            setTotalProducts(ordersList.count);
        }

        setIsLoading(false);
    };

    const handlePageNumber = (nextPage: number) => {
        setPage(nextPage);
        handleUpdateProducts(nextPage);
    };

    const handleOnSearch = async (term: string) => {
        setIsLoading(true);
        setCurrentTerm(term);

        const ordersList = await listAllOrders(LIMIT, 0, term, false);

        if (isListOrders(ordersList)) {
            setOrders(ordersList.orders);
            setTotalProducts(ordersList.count);
        } else {
            setOrders([]);
            setTotalProducts(0);
        }

        setIsLoading(false);
    };

    return (
        <AccountWrapper title="Orders - Account - King of Cardboard" description="Account page">
            <div className="flex flex-col w-full justify-start items-start p-2 md:p-4 md:p-8 md:flex-row relative">
                <Loading show={isLoading} />
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
                    <div className="flex flex-col w-full">
                        <SearchBar onSearch={handleOnSearch} />
                    </div>
                    {orders.length > 0 && (
                        <div className="grid gap-4 grid-cols-1 xl:grid-cols-2">
                            {orders.map((order) => (
                                <OrderComponent order={order} key={`order-${order._id}`} />
                            ))}
                        </div>
                    )}
                    {pageCount > 1 && (
                        <Pagination currentPage={page} pageCount={pageCount} handlePageNumber={handlePageNumber} />
                    )}
                </div>
            </div>
        </AccountWrapper>
    );
};

export default OrdersPage;
