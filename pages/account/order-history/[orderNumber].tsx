import React, { useEffect, useState } from 'react';
import { GetServerSideProps } from 'next';
import { useDispatch, useSelector } from 'react-redux';
import { getSession } from 'next-auth/react';

import PageWrapper from '../../../components/PageWrapper';
import AccountMenu from '../../../components/Account/Menu';
import { parseAsString, safelyParse } from '../../../utils/parsers';
import selector from './selector';
import LongOrder from '../../../components/Account/OrderHistory/LongOrder';
import Loading from '../../../components/Loading';
import { fetchCurrentOrder } from '../../../store/slices/account';
import Custom404Page from '../../404';

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
    const { accessToken, order } = useSelector(selector);
    const [isLoading, setIsLoading] = useState(false);
    const [shouldFetch, setShouldFetch] = useState(true);
    const dispatch = useDispatch();

    useEffect(() => {
        if (accessToken && orderNumber && shouldFetch) {
            setShouldFetch(false);
            setIsLoading(true);
            dispatch(fetchCurrentOrder({ accessToken, orderNumber }));
            setIsLoading(false);
            // fetchOrder(accessToken, emailAddress, orderNumber);
        }
    }, [dispatch, accessToken, orderNumber, shouldFetch]);

    if (errorCode) {
        return <Custom404Page />;
    }

    return (
        <PageWrapper>
            <div className="flex flex-row w-full justify-start items-start">
                <div className="hidden w-1/4 md:block">
                    <AccountMenu isDropdown={false} />
                </div>
                <div className="dropdown w-full p-2 md:hidden">
                    <div tabIndex={0} className="btn btn-block">
                        Account Menu
                    </div>
                    <AccountMenu isDropdown />
                </div>
                <div className="flex flex-col relative w-full px-2 py-0 md:w-3/4 md:px-4 md:px-8">
                    <Loading show={isLoading} />
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
                </div>
            </div>
        </PageWrapper>
    );
};

export default HistoricalOrderPage;
