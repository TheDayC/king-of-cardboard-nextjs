import React, { useEffect, useState } from 'react';
import { GetServerSideProps } from 'next';
import { useDispatch, useSelector } from 'react-redux';
import { getSession } from 'next-auth/react';
import Head from 'next/head';

import PageWrapper from '../../../components/PageWrapper';
import { parseAsString, safelyParse } from '../../../utils/parsers';
import selector from './selector';
import LongOrder from '../../../components/Account/OrderHistory/LongOrder';
import { fetchCurrentOrder, setIsLoadingOrder } from '../../../store/slices/account';
import Custom404Page from '../../404';
import Skeleton from './skeleton';

export const getServerSideProps: GetServerSideProps = async (context) => {
    const session = await getSession(context);
    const orderNumber = safelyParse(context, 'query.orderNumber', parseAsString, null);

    // If session hasn't been established redirect to the login page.
    if (!session) {
        return {
            redirect: {
                permanent: false,
                destination: '/login',
            },
        };
    }

    // If we're signed in then decide whether we should show the page or 404.
    return {
        props: {
            errorCode: !orderNumber ? 404 : null,
            orderNumber,
        },
    };
};

interface OrderProps {
    errorCode: number | boolean;
    orderNumber: string | null;
}

export const HistoricalOrderPage: React.FC<OrderProps> = ({ errorCode, orderNumber }) => {
    const { accessToken, order, isLoadingOrder } = useSelector(selector);
    const [shouldFetch, setShouldFetch] = useState(true);
    const dispatch = useDispatch();

    useEffect(() => {
        if (accessToken && orderNumber && shouldFetch) {
            setShouldFetch(false);
            dispatch(setIsLoadingOrder(true));
            dispatch(fetchCurrentOrder({ accessToken, orderNumber }));
        }
    }, [dispatch, accessToken, orderNumber, shouldFetch]);

    if (errorCode) {
        return <Custom404Page />;
    }

    return (
        <PageWrapper>
            <Head>
                <title>#{orderNumber} - Account - King of Cardboard</title>
                <meta property="og:title" content={`#${orderNumber} - Account - King of Cardboard`} key="title" />
            </Head>
            <div className="flex flex-row w-full justify-start items-start">
                <div className="flex flex-col relative w-full px-2 py-0 md:px-4 md:px-8">
                    {isLoadingOrder ? (
                        <Skeleton />
                    ) : (
                        <LongOrder
                            orderNumber={orderNumber}
                            status={order.status}
                            paymentStatus={order.payment_status}
                            fulfillmentStatus={order.fulfillment_status}
                            itemCount={order.skus_count}
                            shipmentsCount={order.shipments_count}
                            subTotal={order.formatted_subtotal_amount}
                            shippingTotal={order.formatted_shipping_amount}
                            discountTotal={order.formatted_discount_amount}
                            total={order.formatted_total_amount}
                            placedAt={order.placed_at}
                            updatedAt={order.updated_at}
                            lineItems={order.lineItems}
                            shippingAddress={order.shipping_address}
                            billingAddress={order.billing_address}
                            paymentMethodDetails={order.payment_method_details}
                        />
                    )}
                </div>
            </div>
        </PageWrapper>
    );
};

export default HistoricalOrderPage;
