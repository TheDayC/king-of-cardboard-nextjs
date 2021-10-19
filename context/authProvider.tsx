import React, { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DateTime } from 'luxon';
import { get } from 'lodash';

import { useIsomorphicLayoutEffect } from './useIsomorphicLayoutEffect';
import selector from './selector';
import { createOrder, getOrder, getPrices, getStockItems } from '../utils/commerce';
import { setAccessToken, setExpires } from '../store/slices/global';
import {
    fetchOrder as fetchOrderAction,
    setOrder,
    setLineItems,
    setPaymentMethods,
    setUpdatingCart,
} from '../store/slices/cart';
import { fetchProductCollection } from '../utils/products';
import { PRODUCT_QUERY } from '../utils/content';
import { addProductCollection } from '../store/slices/products';
import { rehydration } from '../store';
import { createToken } from '../utils/auth';
import { getShipment, getShipments } from '../utils/checkout';
import { addShipmentWithMethod } from '../store/slices/checkout';

const AuthProvider: React.FC = ({ children }) => {
    const waitForHydro = async () => {
        await rehydration();
    };

    useIsomorphicLayoutEffect(() => {
        waitForHydro();
    }, []);

    const { accessToken, expires, order, products, shouldFetchOrder } = useSelector(selector);
    const dispatch = useDispatch();
    const [shouldCreateOrder, setShouldCreateOrder] = useState(true);

    // Create the productCollection and hydrate.
    const createProductCollection = useCallback(
        async (accessToken: string) => {
            const stockItems = await getStockItems(accessToken);
            const prices = await getPrices(accessToken);
            const products = await fetchProductCollection(PRODUCT_QUERY, stockItems, prices);

            dispatch(addProductCollection(products));
        },
        [dispatch]
    );

    // Fetch order with line items.
    const fetchOrder = useCallback(
        async (accessToken: string, orderId: string) => {
            const fullOrderData = await getOrder(accessToken, orderId, [
                'line_items',
                'available_payment_methods',
                'payment_method',
            ]);

            if (fullOrderData) {
                const { included } = fullOrderData;
                const items = included.filter((data) => data.type === 'line_items');
                const paymentMethods = included.filter((data) => data.type === 'payment_methods');
                const shipmentData = await getShipments(accessToken, orderId);

                if (items) {
                    // Put fetched line items into cart.items store.
                    // Ensure sku_code exists to avoid adding shipping or payment methods.
                    const cartItems = items
                        .filter((item) => item.attributes.sku_code)
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

                if (shipmentData) {
                    const { shipments } = shipmentData;

                    shipments.forEach(async (shipment) => {
                        const shipmentWithMethods = await getShipment(accessToken, shipment);

                        if (shipmentWithMethods) {
                            dispatch(addShipmentWithMethod(shipmentWithMethods));
                        }
                    });
                }

                dispatch(setOrder(fullOrderData));
                dispatch(setUpdatingCart(false));
            }
        },
        [dispatch]
    );

    // Create a brand new order and set the id in the store.
    const generateOrder = useCallback(
        async (accessToken: string) => {
            const order = await createOrder(accessToken);

            if (order) {
                dispatch(setOrder(order));
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
        if (!accessToken) {
            createToken().then((res) => {
                const token = get(res, 'token', null);
                const expires = get(res, 'expires', null);

                dispatch(setAccessToken(token));
                dispatch(setExpires(expires));
            });
        }
    }, [accessToken]);

    // If expiry date has passed, refresh token.
    useIsomorphicLayoutEffect(() => {
        if (accessToken && expires) {
            const expiryDate = DateTime.fromISO(expires, { zone: 'Europe/London' });
            const currentDate = DateTime.now();
            currentDate.setZone('Europe/London');

            // Check to see where our current token has expired.
            if (expiryDate < currentDate) {
                createToken();
            }
        }
    }, [accessToken, expires]);

    // If the order doesn't exist then create one.
    useIsomorphicLayoutEffect(() => {
        if (!order && accessToken && shouldCreateOrder) {
            generateOrder(accessToken);
            setShouldCreateOrder(false);
        }
    }, [order, accessToken, shouldCreateOrder]);

    // Create the product collection on load.
    useIsomorphicLayoutEffect(() => {
        if (products.length <= 0 && accessToken) {
            createProductCollection(accessToken);
        }
    }, [products, accessToken]);

    return <React.Fragment>{children}</React.Fragment>;
};

export default AuthProvider;
