import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useSelector, useDispatch } from 'react-redux';

import selector from './selector';
import { parseAsString, safelyParse } from '../../../utils/parsers';
import ShortOrder from './ShortOrder';
import Loading from '../../Loading';
import Pagination from '../../Pagination';
import { fetchOrderPageCount, fetchOrders } from '../../../store/slices/account';

const PER_PAGE = 5;

export const OrderHistory: React.FC = () => {
    const { accessToken, orders, orderPageCount } = useSelector(selector);
    const { data: session } = useSession();
    const [currentPage, setCurrentPage] = useState(1);
    const [shouldFetch, setShouldFetch] = useState(true);
    const [isLoading, setIsLoading] = useState(true);
    const emailAddress = safelyParse(session, 'user.email', parseAsString, null);
    const dispatch = useDispatch();

    const handlePageNumber = (nextPage: number) => {
        if (accessToken && emailAddress) {
            const page = nextPage + 1;

            setIsLoading(true);
            dispatch(fetchOrders({ accessToken, emailAddress, pageSize: PER_PAGE, page }));
            setCurrentPage(page);
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (accessToken && emailAddress && shouldFetch) {
            setShouldFetch(false);
            dispatch(fetchOrders({ accessToken, emailAddress, pageSize: PER_PAGE, page: currentPage }));
            dispatch(fetchOrderPageCount({ accessToken, emailAddress }));
            setIsLoading(false);
        }
    }, [dispatch, accessToken, emailAddress, shouldFetch, currentPage]);

    return (
        <React.Fragment>
            <Loading show={isLoading} />
            <h1 className="text-xl mb-2 md:text-3xl md:mb-6">Order History</h1>
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
                <Pagination currentPage={currentPage} pageCount={orderPageCount} handlePageNumber={handlePageNumber} />
            )}
        </React.Fragment>
    );
};

export default OrderHistory;
