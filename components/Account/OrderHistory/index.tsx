import React, { useCallback, useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useSelector, useDispatch } from 'react-redux';

import selector from './selector';
import { parseAsArrayOfLineItemRelationships, parseAsNumber, parseAsString, safelyParse } from '../../../utils/parsers';
import { isArrayOfErrors } from '../../../utils/typeguards';
import { getHistoricalOrders } from '../../../utils/account';
import { CommerceLayerResponse } from '../../../types/api';
import ShortOrder from './ShortOrder';
import Loading from '../../Loading';
import Pagination from '../../Pagination';
import { OrderHistoryLineItem } from '../../../types/account';
import { addAlert } from '../../../store/slices/alerts';
import { AlertLevel } from '../../../enums/system';

const ORDERS_PER_PAGE = 5;

export const OrderHistory: React.FC = () => {
    const { accessToken } = useSelector(selector);
    const { data: session } = useSession();
    const [orders, setOrders] = useState<CommerceLayerResponse[] | null>(null);
    const [included, setIncluded] = useState<CommerceLayerResponse[] | null>(null);
    const [pageCount, setPageCount] = useState<number | null>(null);
    const [currentPage, setCurrentPage] = useState(0);
    const emailAddress = safelyParse(session, 'user.email', parseAsString, null);
    const dispatch = useDispatch();

    const fetchOrderHistory = useCallback(
        async (token: string, email: string, page: number = 0, perPage: number = ORDERS_PER_PAGE) => {
            const res = await getHistoricalOrders(token, email, perPage, page + 1);

            if (isArrayOfErrors(res)) {
                res.forEach((value) => {
                    dispatch(addAlert({ message: value.description, level: AlertLevel.Error }));
                });
            } else {
                const { orders: responseOrders, included: responseIncluded, meta } = res;

                setOrders(responseOrders);
                setIncluded(responseIncluded);

                if (meta) {
                    setPageCount(meta.page_count);
                }

                setCurrentPage(page);
            }
        },
        [dispatch]
    );

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
    }, [accessToken, emailAddress, fetchOrderHistory]);

    return (
        <React.Fragment>
            <Loading show={Boolean(!orders || !included)} />
            <h1 className="text-xl mb-2 md:text-3xl md:mb-6">Order History</h1>
            {orders &&
                orders.map((order, i) => {
                    const lineItems = safelyParse(
                        order,
                        'relationships.line_items.data',
                        parseAsArrayOfLineItemRelationships,
                        null
                    );
                    const mergedLineItems: OrderHistoryLineItem[] | null = lineItems
                        ? lineItems.map((lineItem) => {
                              const includedLineItem =
                                  included && included.filter((include) => include.id === lineItem.id);

                              return {
                                  ...lineItem,
                                  sku_code: safelyParse(includedLineItem, 'attributes.sku_code', parseAsString, null),
                                  quantity: safelyParse(includedLineItem, 'attributes.quantity', parseAsNumber, 0),
                                  image_url: safelyParse(includedLineItem, 'attributes.image_url', parseAsString, null),
                              };
                          })
                        : null;

                    return (
                        <ShortOrder
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
                            total={safelyParse(
                                order,
                                'attributes.formatted_total_amount_with_taxes',
                                parseAsString,
                                ''
                            )}
                            placedAt={safelyParse(order, 'attributes.placed_at', parseAsString, '')}
                            updatedAt={safelyParse(order, 'attributes.updated_at', parseAsString, '')}
                            lineItems={mergedLineItems}
                            key={`order-${i}`}
                        />
                    );
                })}
            {pageCount && pageCount > 1 && (
                <Pagination currentPage={currentPage} pageCount={pageCount} handlePageNumber={handlePageNumber} />
            )}
        </React.Fragment>
    );
};

export default OrderHistory;
