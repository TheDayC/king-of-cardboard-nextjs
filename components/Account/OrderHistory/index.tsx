import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useSelector } from 'react-redux';

import selector from './selector';
import { parseAsNumber, parseAsString, safelyParse } from '../../../utils/parsers';
import { getOrders } from '../../../utils/account';
import { CommerceLayerResponse } from '../../../types/api';
import Order from './Order';
import Loading from '../../Loading';
import Pagination from '../../Pagination';

const ORDERS_PER_PAGE = 5;

export const OrderHistory: React.FC = () => {
    const { accessToken } = useSelector(selector);
    const { data: session } = useSession();
    const [orders, setOrders] = useState<CommerceLayerResponse[] | null>(null);
    const [pageCount, setPageCount] = useState<number | null>(null);
    const [currentPage, setCurrentPage] = useState(0);
    const emailAddress = safelyParse(session, 'user.email', parseAsString, null);

    const fetchOrderHistory = async (
        token: string,
        email: string,
        page: number = 0,
        perPage: number = ORDERS_PER_PAGE
    ) => {
        const response = await getOrders(token, email, perPage, page + 1);

        if (response) {
            const { orders: responseOrders, meta } = response;

            setOrders(responseOrders);

            if (meta) {
                setPageCount(meta.page_count);
            }

            setCurrentPage(page);
        }
    };

    const handlePageNumber = (nextPage: number) => {
        if (accessToken && emailAddress) {
            setOrders(null);
            fetchOrderHistory(accessToken, emailAddress, nextPage);
        }
    };

    useEffect(() => {
        if (accessToken && emailAddress) {
            fetchOrderHistory(accessToken, emailAddress);
        }
    }, [accessToken, emailAddress]);

    return (
        <React.Fragment>
            <h1 className="text-3xl mb-6">Order History</h1>
            {orders ? (
                orders.map((order, i) => (
                    <Order
                        orderNumber={safelyParse(order, 'attributes.number', parseAsNumber, null)}
                        status={safelyParse(order, 'attributes.status', parseAsString, 'draft')}
                        paymentStatus={safelyParse(order, 'attributes.payment_status', parseAsString, 'unpaid')}
                        fulfillmentStatus={safelyParse(
                            order,
                            'attributes.fulfillment_status',
                            parseAsString,
                            'unfulfilled'
                        )}
                        itemCount={safelyParse(order, 'attributes.skus_count', parseAsNumber, 0)}
                        shipmentsCount={safelyParse(order, 'attributes.shipments_count', parseAsNumber, 0)}
                        total={safelyParse(order, 'attributes.formatted_total_amount_with_taxes', parseAsString, '')}
                        placedAt={safelyParse(order, 'attributes.placed_at', parseAsString, '')}
                        updatedAt={safelyParse(order, 'attributes.updated_at', parseAsString, '')}
                        key={`order-${i}`}
                    />
                ))
            ) : (
                <Loading show />
            )}
            {pageCount && pageCount > 1 && (
                <Pagination currentPage={currentPage} pageCount={pageCount} handlePageNumber={handlePageNumber} />
            )}
        </React.Fragment>
    );
};

export default OrderHistory;
