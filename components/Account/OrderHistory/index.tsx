import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useSession } from 'next-auth/react';

import selector from './selector';
import ShortOrder from './ShortOrder';
import Pagination from '../../Pagination';
import { fetchOrders, setIsLoadingOrders } from '../../../store/slices/account';
import Skeleton from './skeleton';
import { parseAsString, safelyParse } from '../../../utils/parsers';
import { getPrettyPrice } from '../../../utils/account/products';

const PER_PAGE = 5;

export const OrderHistory: React.FC = () => {
    const dispatch = useDispatch();
    const { data: session } = useSession();
    const { orders, orderCount, isLoadingOrders } = useSelector(selector);
    const [currentPage, setCurrentPage] = useState(1);
    const userId = safelyParse(session, 'user.id', parseAsString, null);

    const handlePageNumber = (nextPage: number) => {
        if (userId) {
            const page = nextPage + 1;

            dispatch(setIsLoadingOrders(true));
            dispatch(fetchOrders({ userId, size: PER_PAGE, page }));
            setCurrentPage(page);
        }
    };

    useEffect(() => {
        if (userId) {
            dispatch(setIsLoadingOrders(true));
            dispatch(fetchOrders({ userId, size: PER_PAGE, page: currentPage }));
        }
    }, [dispatch, currentPage, userId]);

    if (isLoadingOrders) {
        return <Skeleton />;
    } else {
        return (
            <React.Fragment>
                {orders.length > 0 &&
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
                    })}
                {orderCount > 1 && (
                    <Pagination
                        currentPage={currentPage - 1}
                        pageCount={orderCount}
                        handlePageNumber={handlePageNumber}
                    />
                )}
            </React.Fragment>
        );
    }
};

export default OrderHistory;
