import React from 'react';
import { GetServerSideProps } from 'next';
import { unstable_getServerSession } from 'next-auth';
import { toNumber } from 'lodash';

import { parseAsString, safelyParse } from '../../../utils/parsers';
import LongOrder from '../../../components/Account/OrderHistory/LongOrder';
import { authOptions } from '../../api/auth/[...nextauth]';
import { isOrder } from '../../../utils/typeguards';
import { getOrder } from '../../../utils/order';
import { Order } from '../../../types/orders';
import AccountWrapper from '../../../components/AccountWrapper';
import { formatOrderNumber } from '../../../utils/checkout';

export const getServerSideProps: GetServerSideProps = async ({ req, res, query }) => {
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
    const orderNumber = safelyParse(query, 'orderNumber', parseAsString, '0');
    const order = await getOrder(userId, toNumber(orderNumber));

    if (!orderNumber || !userId || !isOrder(order)) {
        return {
            redirect: {
                permanent: false,
                destination: '/account/order-history',
            },
        };
    }

    // If we're signed in then decide whether we should show the page or 404.
    return {
        props: {
            order,
        },
    };
};

interface HistoricalOrderPageProps {
    order: Order;
}

export const HistoricalOrderPage: React.FC<HistoricalOrderPageProps> = ({ order }) => {
    return (
        <AccountWrapper
            title={`Order ${formatOrderNumber(order.orderNumber)} - Account - King of Cardboard`}
            description={`Your historical order #${order.orderNumber} details.`}
        >
            <div className="flex flex-col relative w-full py-4 px-6">
                <LongOrder
                    orderNumber={order.orderNumber}
                    orderStatus={order.orderStatus}
                    paymentStatus={order.paymentStatus}
                    fulfillmentStatus={order.fulfillmentStatus}
                    subTotal={order.subTotal}
                    shipping={order.shipping}
                    discount={order.discount}
                    total={order.total}
                    created={order.created}
                    lastUpdated={order.lastUpdated}
                    items={order.items}
                    itemCount={order.items.length}
                    shippingAddress={order.shippingAddress}
                    billingAddress={order.billingAddress}
                    paymentId={order.paymentId}
                    paymentMethod={order.paymentMethod}
                />
            </div>
        </AccountWrapper>
    );
};

export default HistoricalOrderPage;
