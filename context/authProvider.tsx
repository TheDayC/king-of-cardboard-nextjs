import React, { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DateTime } from 'luxon';
import { useSession } from 'next-auth/react';

import { useIsomorphicLayoutEffect } from './useIsomorphicLayoutEffect';
import selector from './authSelector';
import { createOrder, getOrder } from '../utils/commerce';
import { fetchToken, setAccessToken, setCheckoutLoading, setExpires } from '../store/slices/global';
import {
    fetchOrder as fetchOrderAction,
    setOrder,
    setLineItems,
    setPaymentMethods,
    setUpdatingCart,
    createCLOrder,
} from '../store/slices/cart';
import { createToken } from '../utils/auth';
import { parseAsString, safelyParse } from '../utils/parsers';

const AuthProvider: React.FC = ({ children }) => {
    const { accessToken, expires, orderId, shouldFetchOrder, shouldCreateOrder } = useSelector(selector);
    const dispatch = useDispatch();
    const currentDate = DateTime.now().setZone('Europe/London');
    const expiryDate = DateTime.fromISO(expires || currentDate.toISO(), { zone: 'Europe/London' });
    const hasExpired = Boolean(expires && expiryDate < currentDate);
    const { data: session } = useSession();
    const isGuest = !Boolean(session);

    // Fetch order with line items.
    /* const fetchOrder = useCallback(
        async (accessToken: string, orderId: string) => {
            const orderRes = await getOrder(accessToken, orderId, [
                'line_items',
                'available_payment_methods',
                'payment_method',
                'billing_address',
                'shipping_address',
            ]);
            if (orderRes) {
                const { included } = orderRes;
                const items = included.filter((data) => data.type === 'line_items');
                const paymentMethods = included.filter((data) => data.type === 'payment_methods');

                if (items) {
                    // Put fetched line items into cart.items store.
                    // Ensure sku_code exists to avoid adding shipping or payment methods.
                    const cartItems = items
                        .filter((item) => safelyParse(item, 'attributes.sku_code', parseAsString, null))
                        .map((item) => ({
                            ...item.attributes,
                            id: item.id,
                        }));

                    dispatch(setLineItems(cartItems));
                }

                if (paymentMethods) {
                    const cartPaymentMethods = paymentMethods.map((method) => ({
                        ...method.attributes,
                        id: method.id,
                    }));

                    dispatch(setPaymentMethods(cartPaymentMethods));
                }

                // Set the entire order in the store.
                dispatch(setOrder(orderRes));

                // Ensure the cart isn't updating after the order has been fetched.
                dispatch(setUpdatingCart(false));

                // Ensure Checkout loading has also reset on a fetched order.
                dispatch(setCheckoutLoading(false));
            }
        },
        [dispatch]
    ); */

    // Create a brand new order and set the id in the store.
    const generateOrder = useCallback(async () => {
        if (shouldCreateOrder && accessToken) {
            dispatch(createCLOrder({ accessToken, isGuest }));
        }
    }, [dispatch, isGuest, shouldCreateOrder, accessToken]);

    // If order does exist then hydrate with line items.
    /* useIsomorphicLayoutEffect(() => {
        if (accessToken && order && shouldFetchOrder) {
            fetchOrder(accessToken, order.id);
            dispatch(fetchOrderAction(false));
        }
    }, [order, shouldFetchOrder, accessToken]); */

    // If accessToken doesn't exist create one.
    useIsomorphicLayoutEffect(() => {
        if (!accessToken || hasExpired) {
            dispatch(fetchToken());
        }
    }, [accessToken, hasExpired]);

    // If the order doesn't exist then create one.
    useIsomorphicLayoutEffect(() => {
        if (shouldCreateOrder) {
            generateOrder();
        }
    }, [shouldCreateOrder]);

    return <React.Fragment>{children}</React.Fragment>;
};

export default AuthProvider;
