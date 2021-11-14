import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import Error from 'next/error';
import { useSelector } from 'react-redux';

import Header from '../../../components/Header';
import AccountMenu from '../../../components/Account/Menu';
import { getHistoricalOrder } from '../../../utils/account';
import {
    parseAsHistoricalAddress,
    parseAsNumber,
    parseAsPaymentMethodDetails,
    parseAsString,
    safelyParse,
} from '../../../utils/parsers';
import selector from './selector';
import { CommerceLayerResponse } from '../../../types/api';
import { OrderHistoryLineItem, OrderHistoryLineItemWithSkuData } from '../../../types/account';
import LongOrder from '../../../components/Account/OrderHistory/LongOrder';
import { getSkus } from '../../../utils/commerce';
import { SkuItem } from '../../../types/commerce';

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

interface OrderProps {
    errorCode: number | boolean;
    orderNumber: string | null;
    emailAddress: string | null;
}

export const HistoricalOrderPage: React.FC<OrderProps> = ({ errorCode, orderNumber, emailAddress }) => {
    const { accessToken } = useSelector(selector);
    const [order, setOrder] = useState<CommerceLayerResponse | null>(null);
    const [included, setIncluded] = useState<CommerceLayerResponse[] | null>(null);
    const [lineItems, setLineItems] = useState<OrderHistoryLineItemWithSkuData[] | null>(null);

    const status = safelyParse(order, 'attributes.status', parseAsString, 'draft');
    const paymentStatus = safelyParse(order, 'attributes.payment_status', parseAsString, 'unpaid');
    const fulfillmentStatus = safelyParse(order, 'attributes.fulfillment_status', parseAsString, 'unfulfilled');
    const itemCount = safelyParse(order, 'attributes.skus_count', parseAsNumber, 0);
    const shipmentsCount = safelyParse(order, 'attributes.shipments_count', parseAsNumber, 0);
    const subTotal = safelyParse(order, 'attributes.formatted_subtotal_amount', parseAsString, '');
    const shippingTotal = safelyParse(order, 'attributes.formatted_shipping_amount', parseAsString, '');
    const discountTotal = safelyParse(order, 'attributes.formatted_discount_amount', parseAsString, '');
    const total = safelyParse(order, 'attributes.formatted_total_amount', parseAsString, '');
    const placedAt = safelyParse(order, 'attributes.placed_at', parseAsString, '');
    const updatedAt = safelyParse(order, 'attributes.updated_at', parseAsString, '');

    const includedLineItems = useMemo(
        () => (included ? included.filter((include) => include.attributes.sku_code) : null),
        [included]
    );
    const lineItemSkus = useMemo(
        () => (includedLineItems ? includedLineItems.map((include) => include.attributes.sku_code) : []),
        [includedLineItems]
    );

    const shippingAddress = useMemo(() => {
        const shippingAddressId = safelyParse(order, 'relationships.shipping_address.data.id', parseAsString, '');
        const shippingAddressInclude = included
            ? included.find((include) => include.type === 'addresses' && include.id === shippingAddressId)
            : null;

        return safelyParse(shippingAddressInclude, 'attributes', parseAsHistoricalAddress, blankAddress);
    }, [included]);

    const billingAddress = useMemo(() => {
        const billingAddressId = safelyParse(order, 'relationships.billing_address.data.id', parseAsString, '');
        const billingAddressInclude = included
            ? included.find((include) => include.type === 'addresses' && include.id === billingAddressId)
            : null;

        return safelyParse(billingAddressInclude, 'attributes', parseAsHistoricalAddress, blankAddress);
    }, [included]);

    const paymentMethodDetails = useMemo(
        () =>
            safelyParse(
                order,
                'attributes.payment_source_details.payment_method_details',
                parseAsPaymentMethodDetails,
                null
            ),
        [order]
    );

    const fetchOrder = useCallback(async (token: string, email: string, order: string) => {
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
    }, []);

    const fetchSkuItems = useCallback(async (token: string, skus: string[], includedItems: CommerceLayerResponse[]) => {
        const skuItems = await getSkus(token, skus);

        if (skuItems) {
            const lineItems: OrderHistoryLineItemWithSkuData[] = includedItems.map((lineItem) => {
                const skuCode = safelyParse(lineItem, 'attributes.sku_code', parseAsString, null);
                const skuItem = skuItems ? skuItems.find((item) => item.sku_code === skuCode) : null;

                return {
                    lineItemId: safelyParse(lineItem, 'id', parseAsString, ''),
                    skuId: safelyParse(skuItem, 'id', parseAsString, ''),
                    name: safelyParse(skuItem, 'name', parseAsString, null),
                    skuCode: skuCode,
                    imageUrl: safelyParse(skuItem, 'image_url', parseAsString, null),
                    quantity: safelyParse(lineItem, 'attributes.quantity', parseAsNumber, 0),
                    amount: safelyParse(skuItem, 'amount', parseAsString, null),
                    compareAmount: safelyParse(skuItem, 'amount', parseAsString, null),
                };
            });
            setLineItems(lineItems);
        }
    }, []);

    useEffect(() => {
        if (accessToken && emailAddress && orderNumber) {
            fetchOrder(accessToken, emailAddress, orderNumber);
        }
    }, [accessToken, emailAddress, orderNumber]);

    useEffect(() => {
        if (accessToken && lineItemSkus && includedLineItems) {
            console.log('Triggered');
            fetchSkuItems(accessToken, lineItemSkus, includedLineItems);
        }
    }, [accessToken, lineItemSkus, includedLineItems]);

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
                                subTotal={subTotal}
                                shippingTotal={shippingTotal}
                                discountTotal={discountTotal}
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
