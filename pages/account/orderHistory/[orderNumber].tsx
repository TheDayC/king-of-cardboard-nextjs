import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { DateTime } from 'luxon';
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import Error from 'next/error';
import { useSelector } from 'react-redux';

import Header from '../../../components/Header';
import AccountMenu from '../../../components/Account/Menu';
import { statusColour, paymentStatusColour, fulfillmentStatusColour, getHistoricalOrder } from '../../../utils/account';
import {
    parseAsArrayOfLineItemRelationships,
    parseAsAttributes,
    parseAsHistoricalAddress,
    parseAsNumber,
    parseAsPaymentMethodDetails,
    parseAsString,
    safelyParse,
} from '../../../utils/parsers';
import selector from './selector';
import { CommerceLayerResponse } from '../../../types/api';
import { OrderHistoryLineItem } from '../../../types/account';
import LongOrder from '../../../components/Account/OrderHistory/LongOrder';

export const getServerSideProps: GetServerSideProps = async (context) => {
    const session = await getSession(context);
    const orderNumber = safelyParse(context, 'query.orderNumber', parseAsString, null);
    const emailAddress = safelyParse(session, 'user.email', parseAsString, null);

    const errorCode = orderNumber ? false : 404;

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
            errorCode,
            orderNumber,
            emailAddress,
        },
    };
};

interface OrderProps {
    errorCode: number | boolean;
    orderNumber: string | null;
    emailAddress: string | null;
}

export const HistoricalOrderPage: React.FC<OrderProps> = ({ errorCode, orderNumber, emailAddress }) => {
    const { accessToken } = useSelector(selector);
    const [order, setOrder] = useState<CommerceLayerResponse | null>(null);
    const [included, setIncluded] = useState<CommerceLayerResponse[] | null>(null);

    const status = safelyParse(order, 'attributes.status', parseAsString, 'draft');
    const paymentStatus = safelyParse(order, 'attributes.payment_status', parseAsString, 'unpaid');
    const fulfillmentStatus = safelyParse(order, 'attributes.fulfillment_status', parseAsString, 'unfulfilled');
    const itemCount = safelyParse(order, 'attributes.skus_count', parseAsNumber, 0);
    const shipmentsCount = safelyParse(order, 'attributes.shipments_count', parseAsNumber, 0);
    const total = safelyParse(order, 'attributes.formatted_total_amount_with_taxes', parseAsString, '');
    const placedAt = safelyParse(order, 'attributes.placed_at', parseAsString, '');
    const updatedAt = safelyParse(order, 'attributes.updated_at', parseAsString, '');
    const shippingAddressId = safelyParse(order, 'relationships.shipping_address.data.id', parseAsString, '');
    const billingAddressId = safelyParse(order, 'relationships.billing_address.data.id', parseAsString, '');

    const rawLineItems = safelyParse(order, 'relationships.line_items.data', parseAsArrayOfLineItemRelationships, null);
    const lineItems: OrderHistoryLineItem[] | null = rawLineItems
        ? rawLineItems.map((lineItem) => {
              const includedLineItem = included ? included.filter((include) => include.id === lineItem.id) : null;

              return {
                  ...lineItem,
                  sku_code: safelyParse(includedLineItem, 'attributes.sku_code', parseAsString, null),
                  quantity: safelyParse(includedLineItem, 'attributes.quantity', parseAsNumber, 0),
                  image_url: safelyParse(includedLineItem, 'attributes.image_url', parseAsString, null),
              };
          })
        : null;
    const blankAddress = {
        first_name: null,
        last_name: null,
        company: null,
        line_1: null,
        line_2: null,
        city: null,
        zip_code: null,
        state_code: null,
        country_code: null,
        phone: null,
    };
    const shippingAddressInclude = included
        ? included.find((include) => include.type === 'addresses' && include.id === shippingAddressId)
        : null;
    const shippingAddress = safelyParse(shippingAddressInclude, 'attributes', parseAsHistoricalAddress, blankAddress);

    const billingAddressInclude = included
        ? included.find((include) => include.type === 'addresses' && include.id === billingAddressId)
        : null;
    const billingAddress = safelyParse(billingAddressInclude, 'attributes', parseAsHistoricalAddress, blankAddress);

    const paymentMethodDetails = safelyParse(
        order,
        'attributes.payment_source_details.payment_method_details',
        parseAsPaymentMethodDetails,
        null
    );

    const fetchOrder = async (token: string, email: string, order: string) => {
        const response = await getHistoricalOrder(token, email, order);

        if (response) {
            const { orders: responseOrders, included: responseIncluded } = response;

            if (responseOrders) {
                setOrder(responseOrders[0]);
            }

            if (responseIncluded) {
                setIncluded(responseIncluded);
            }
        }
    };

    useEffect(() => {
        if (accessToken && emailAddress && orderNumber) {
            fetchOrder(accessToken, emailAddress, orderNumber);
        }
    }, [accessToken, emailAddress, orderNumber]);

    // Show error page if a code is provided.
    if (errorCode && typeof errorCode === 'number') {
        return <Error statusCode={errorCode} />;
    }

    return (
        <React.Fragment>
            <Header />
            <div className="flex p-4 relative">
                <div className="container mx-auto">
                    <div className="flex flex-row w-full justify-start items-start">
                        <div className="w-1/4">
                            <AccountMenu />
                        </div>
                        <div className="flex flex-col py-4 px-8 w-3/4">
                            <LongOrder
                                orderNumber={orderNumber}
                                status={status}
                                paymentStatus={paymentStatus}
                                fulfillmentStatus={fulfillmentStatus}
                                itemCount={itemCount}
                                shipmentsCount={shipmentsCount}
                                total={total}
                                placedAt={placedAt}
                                updatedAt={updatedAt}
                                lineItems={lineItems}
                                shippingAddress={shippingAddress}
                                billingAddress={billingAddress}
                                paymentMethodDetails={paymentMethodDetails}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
};

export default HistoricalOrderPage;
