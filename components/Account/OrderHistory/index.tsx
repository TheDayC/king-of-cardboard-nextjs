import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import selector from './selector';
import ShortOrder from './ShortOrder';
import Loading from '../../Loading';
import Pagination from '../../Pagination';
import { fetchOrders } from '../../../store/slices/account';

const PER_PAGE = 5;

export const OrderHistory: React.FC = () => {
    const { accessToken, orders, orderPageCount, userId, userToken } = useSelector(selector);
    const [currentPage, setCurrentPage] = useState(1);
    const [shouldFetch, setShouldFetch] = useState(true);
    const [isLoading, setIsLoading] = useState(true);
    const dispatch = useDispatch();

    const handlePageNumber = (nextPage: number) => {
        if (accessToken && userId && userToken) {
            const page = nextPage + 1;

            setIsLoading(true);
            dispatch(fetchOrders({ accessToken, userToken, userId, pageSize: PER_PAGE, page }));
            //setCurrentPage(page);
            setTimeout(() => setCurrentPage(page), 700);
            // setIsLoading(false);
        }
    };

    useEffect(() => {
        if (accessToken && shouldFetch && userId && userToken) {
            setShouldFetch(false);
            dispatch(fetchOrders({ accessToken, userToken, userId, pageSize: PER_PAGE, page: currentPage }));
            setIsLoading(false);
        }
    }, [dispatch, accessToken, shouldFetch, currentPage, userId, userToken]);

    useEffect(() => {
        if (currentPage) {
            setIsLoading(false);
        }
    }, [currentPage]);

    return (
        <React.Fragment>
            <Loading show={isLoading} />
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
};

export default OrderHistory;
