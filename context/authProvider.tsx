import React, { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DateTime } from 'luxon';
import { get } from 'lodash';

import { useIsomorphicLayoutEffect } from './useIsomorphicLayoutEffect';
import selector from './authSelector';
import { createOrder, getOrder } from '../utils/commerce';
import { setAccessToken, setCheckoutLoading, setExpires } from '../store/slices/global';
import {
    fetchOrder as fetchOrderAction,
    setOrder,
    setLineItems,
    setPaymentMethods,
    setUpdatingCart,
} from '../store/slices/cart';
import { createToken } from '../utils/auth';
import { getShipment, getShipments } from '../utils/checkout';
import { addShipmentWithMethod } from '../store/slices/checkout';
import { parseAsString, safelyParse } from '../utils/parsers';
import { isArrayOfErrors, isError } from '../utils/typeguards';
import { addAlert } from '../store/slices/alerts';
import { AlertLevel } from '../enums/system';

const AuthProvider: React.FC = ({ children }) => {
    const { accessToken, expires, order, shouldFetchOrder } = useSelector(selector);
    const dispatch = useDispatch();
    const [shouldCreateOrder, setShouldCreateOrder] = useState(true);
    const currentDate = DateTime.now().setZone('Europe/London');
    const expiryDate = DateTime.fromISO(expires || currentDate.toISO(), { zone: 'Europe/London' });
    const hasExpired = Boolean(expires && expiryDate < currentDate);

    // Fetch an auth token for the user to interact with commerceLayer.
    const fetchToken = useCallback(async () => {
        const res = await createToken();

        if (isArrayOfErrors(res)) {
            res.forEach((value) => {
                dispatch(addAlert({ message: value.description, level: AlertLevel.Error }));
            });
        } else {
            const { token, expires } = res;

            dispatch(setAccessToken(token));
            dispatch(setExpires(expires));
        }
    }, []);

    // Fetch order with line items.
    const fetchOrder = useCallback(
        async (accessToken: string, orderId: string) => {
            const orderRes = await getOrder(accessToken, orderId, [
                'line_items',
                'available_payment_methods',
                'payment_method',
                'billing_address',
                'shipping_address',
            ]);
            if (isArrayOfErrors(orderRes)) {
                orderRes.forEach((value) => {
                    dispatch(addAlert({ message: value.description, level: AlertLevel.Error }));
                });
            } else {
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

                    const shipmentRes = await getShipments(accessToken, orderId);

                    if (isArrayOfErrors(shipmentRes)) {
                        shipmentRes.forEach((value) => {
                            dispatch(addAlert({ message: value.description, level: AlertLevel.Error }));
                        });
                    } else {
                        if (shipmentRes) {
                            const { shipments } = shipmentRes;

                            shipments.forEach(async (shipment) => {
                                const shipmentWithMethods = await getShipment(accessToken, shipment);

                                if (isArrayOfErrors(shipmentWithMethods)) {
                                    shipmentWithMethods.forEach((value) => {
                                        dispatch(addAlert({ message: value.description, level: AlertLevel.Error }));
                                    });
                                } else {
                                    if (shipmentWithMethods) {
                                        dispatch(addShipmentWithMethod(shipmentWithMethods));
                                    }
                                }
                            });
                        }
                    }

                    // Set the entire order in the store.
                    dispatch(setOrder(orderRes));

                    // Ensure the cart isn't updating after the order has been fetched.
                    dispatch(setUpdatingCart(false));

                    // Ensure Checkout loading has also reset on a fetched order.
                    dispatch(setCheckoutLoading(false));
                }
            }
        },
        [dispatch]
    );

    // Create a brand new order and set the id in the store.
    const generateOrder = useCallback(
        async (accessToken: string) => {
            const order = await createOrder(accessToken);

            if (isArrayOfErrors(order)) {
                order.forEach((value) => {
                    dispatch(addAlert({ message: value.description, level: AlertLevel.Error }));
                });
            } else {
                if (order) {
                    dispatch(setOrder(order));
                }
            }
        },
        [dispatch]
    );

    // If order does exist then hydrate with line items.
    useIsomorphicLayoutEffect(() => {
        if (accessToken && order && shouldFetchOrder) {
            fetchOrder(accessToken, order.id);
            dispatch(fetchOrderAction(false));
        }
    }, [order, shouldFetchOrder, accessToken]);

    // If accessToken doesn't exist create a new one.
    useIsomorphicLayoutEffect(() => {
        if (!accessToken || hasExpired) {
            fetchToken();
        }
    }, [accessToken, hasExpired]);

    // If the order doesn't exist then create one.
    useIsomorphicLayoutEffect(() => {
        if (!order && accessToken && shouldCreateOrder) {
            generateOrder(accessToken);
            setShouldCreateOrder(false);
        }
    }, [order, accessToken, shouldCreateOrder]);

    return <React.Fragment>{children}</React.Fragment>;
};

export default AuthProvider;
