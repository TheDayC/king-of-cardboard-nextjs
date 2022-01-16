import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import selector from './selector';
import ShortOrder from './ShortOrder';
import Pagination from '../../Pagination';
import { fetchOrders, setIsLoadingOrders } from '../../../store/slices/account';
import Skeleton from './skeleton';

const PER_PAGE = 5;

export const OrderHistory: React.FC = () => {
    const { accessToken, orders, orderPageCount, userId, userToken, isLoadingOrders } = useSelector(selector);
    const [currentPage, setCurrentPage] = useState(1);
    const [shouldFetch, setShouldFetch] = useState(true);
    const dispatch = useDispatch();

    const handlePageNumber = (nextPage: number) => {
        if (accessToken && userId && userToken) {
            const page = nextPage + 1;

            dispatch(setIsLoadingOrders(true));
            dispatch(fetchOrders({ accessToken, userToken, userId, pageSize: PER_PAGE, page }));
            setCurrentPage(page);
        }
    };

    useEffect(() => {
        if (accessToken && shouldFetch && userId && userToken) {
            setShouldFetch(false);
            dispatch(setIsLoadingOrders(true));
            dispatch(fetchOrders({ accessToken, userToken, userId, pageSize: PER_PAGE, page: currentPage }));
        }
    }, [dispatch, accessToken, shouldFetch, currentPage, userId, userToken]);

    if (isLoadingOrders) {
        return <Skeleton />;
    } else {
        return (
            <React.Fragment>
                {orders.length > 0 &&
                    orders.map((order, i) => {
                        return (
                            <ShortOrder
                                orderNumber={order.number}
                                status={order.status}
                                paymentStatus={order.payment_status}
                                fulfillmentStatus={order.fulfillment_status}
                                itemCount={order.skus_count}
                                shipmentsCount={order.shipments_count}
                                total={order.formatted_total_amount_with_taxes}
                                placedAt={order.placed_at}
                                updatedAt={order.updated_at}
                                lineItems={order.lineItems}
                                key={`order-${i}`}
                            />
                        );
                    })}
                {orderPageCount > 1 && (
                    <Pagination
                        currentPage={currentPage - 1}
                        pageCount={orderPageCount}
                        handlePageNumber={handlePageNumber}
                    />
                )}
            </React.Fragment>
        );
    }
};

export default OrderHistory;
