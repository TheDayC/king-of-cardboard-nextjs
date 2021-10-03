import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DateTime } from 'luxon';
import { get } from 'lodash';

import { useIsomorphicLayoutEffect } from './useIsomorphicLayoutEffect';
import selector from './selector';
import { createOrder, getOrder, getPrices, getStockItems } from '../utils/commerce';
import { setAccessToken, setExpires } from '../store/slices/global';
import { fetchOrder as fetchOrderAction, setOrder, setLineItems, setPaymentMethods } from '../store/slices/cart';
import { fetchProductCollection } from '../utils/products';
import { PRODUCT_QUERY } from '../utils/content';
import { addProductCollection } from '../store/slices/products';
import { rehydration } from '../store';
import { createToken } from '../utils/auth';

const AuthProvider: React.FC = ({ children }) => {
    const waitForHydro = async () => {
        await rehydration();
    };

    useIsomorphicLayoutEffect(() => {
        waitForHydro();
    }, []);

    const { accessToken, expires, order, products, cartItems, shouldFetchOrder } = useSelector(selector);
    const dispatch = useDispatch();

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
            const fullOrderData = await getOrder(accessToken, orderId, ['line_items', 'available_payment_methods']);

            if (fullOrderData) {
                const { included } = fullOrderData;
                const items = included.filter((data) => data.type === 'line_items');
                const paymentMethods = included.filter((data) => data.type === 'payment_methods');

                if (items) {
                    const cartItems = items.map((item) => ({
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

                dispatch(setOrder(order));
            }

            dispatch(fetchOrderAction(false));
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
        }
    }, [order, shouldFetchOrder, accessToken]);

    // If we add something to the cart, trigger an order fetch.
    useIsomorphicLayoutEffect(() => {
        if (cartItems) {
            dispatch(fetchOrderAction(true));
        }
    }, [cartItems]);

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
        if (!order && accessToken) {
            generateOrder(accessToken);
        }
    }, [order, accessToken]);

    // Create the product collection on load.
    useIsomorphicLayoutEffect(() => {
        if (products.length <= 0 && accessToken) {
            createProductCollection(accessToken);
        }
    }, [products, accessToken]);

    return <React.Fragment>{children}</React.Fragment>;
};

export default AuthProvider;
