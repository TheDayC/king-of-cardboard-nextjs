import React, { useMemo, useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DateTime } from 'luxon';
import { CommerceLayerClient } from '@commercelayer/sdk';

import AuthProviderContext from './context';
import { useIsomorphicLayoutEffect } from './useIsomorphicLayoutEffect';
import selector from './selector';
import { getCommerceAuth, initCommerceClient, orderQueryParams } from '../utils/commerce';
import { setAccessToken, setExpires } from '../store/slices/global';
import { createOrder, updateOrder, fetchOrder as fetchOrderAction } from '../store/slices/cart';
import { fetchProductCollection } from '../utils/products';
import { PRODUCT_QUERY } from '../utils/content';
import { addProductCollection } from '../store/slices/products';
import { rehydration } from '../store';

const AuthProvider: React.FC = ({ children }) => {
    const waitForHydro = async () => {
        await rehydration();
    };

    useIsomorphicLayoutEffect(() => {
        waitForHydro();
    }, []);

    const { accessToken, expires, order, products, cartItems, shouldFetchOrder } = useSelector(selector);
    const dispatch = useDispatch();

    const createNewToken = useCallback(async () => {
        const token = await getCommerceAuth();

        if (token) {
            dispatch(setAccessToken(token.accessToken));
            dispatch(setExpires(token.expires));
        }
    }, [dispatch]);

    // Init the client if accessToken is available.
    const commerceLayer = useMemo(() => {
        return accessToken ? initCommerceClient(accessToken) : null;
    }, [accessToken]);

    // Create a draft order for the current session and add to store.
    const createNewOrder = useCallback(
        async (cl: CommerceLayerClient) => {
            const order = await cl.orders.create({ guest: true });

            dispatch(createOrder(order));
        },
        [dispatch]
    );

    // Create the productCollection and hydrate.
    const createProductCollection = useCallback(
        async (cl: CommerceLayerClient) => {
            const stockItems = await cl.stock_items.list();
            const prices = await cl.prices.list();
            const products = await fetchProductCollection(PRODUCT_QUERY, stockItems, prices);

            dispatch(addProductCollection(products));
        },
        [dispatch]
    );

    // Fetch order with line items.
    const fetchOrder = useCallback(
        async (cl: CommerceLayerClient) => {
            if (cl && order) {
                const fetchedOrder = await cl.orders.retrieve(order.id, orderQueryParams);
                console.log('🚀 ~ file: authProvider.tsx ~ line 70 ~ fetchedOrder', fetchedOrder);

                if (fetchedOrder) {
                    dispatch(updateOrder(fetchedOrder));
                }
            }
        },
        [dispatch, order]
    );

    // Create the product collection on load.
    useIsomorphicLayoutEffect(() => {
        if (commerceLayer && products.length <= 0) {
            createProductCollection(commerceLayer);
        }
    }, [products, createProductCollection, commerceLayer]);

    // If the order doesn't exist then create one.
    useIsomorphicLayoutEffect(() => {
        if (commerceLayer && !order) {
            createNewOrder(commerceLayer);
        }
    }, [order, commerceLayer]);

    // If order does exist then hydrate with line items.
    useIsomorphicLayoutEffect(() => {
        if (commerceLayer && order && shouldFetchOrder) {
            fetchOrder(commerceLayer);
            dispatch(fetchOrderAction(false));
        }
    }, [order, commerceLayer, shouldFetchOrder]);

    // If we add something to the cart, trigger an order fetch.
    /* useIsomorphicLayoutEffect(() => {
        if (cartItems) {
            dispatch(fetchOrderAction(true));
        }
    }, [cartItems]); */

    // If accessToken doesn't exist create a new one.
    useIsomorphicLayoutEffect(() => {
        if (!accessToken) {
            createNewToken();
        }
    }, [accessToken, createNewToken]);

    // If expiry date has passed, refresh token.
    useIsomorphicLayoutEffect(() => {
        if (accessToken && expires) {
            const expiryDate = DateTime.fromISO(expires, { zone: 'Europe/London' });
            const currentDate = DateTime.now();
            currentDate.setZone('Europe/London');

            // Check to see where our current token has expired.
            if (expiryDate < currentDate) {
                createNewToken();
            }
        }
    }, [accessToken, expires, createNewToken]);

    // Our context value that we'll provide to the app.
    const contextValue = useMemo(() => {
        return commerceLayer;
    }, [commerceLayer]);

    const Context = AuthProviderContext;

    return <Context.Provider value={contextValue}>{children}</Context.Provider>;
};

export default AuthProvider;
