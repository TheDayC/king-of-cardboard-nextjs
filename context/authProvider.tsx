import React, { useMemo, useCallback, useContext } from 'react';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { DateTime } from 'luxon';
import { CommerceLayerClient } from '@commercelayer/sdk';
import axios from 'axios';
import { get } from 'lodash';

import AuthProviderContext from './context';
import { useIsomorphicLayoutEffect } from './useIsomorphicLayoutEffect';
import selector from './selector';
import {
    createOrder,
    createProductCollection,
    getCommerceAuth,
    getPrices,
    getStockItems,
    initCommerceClient,
} from '../utils/commerce';
import { setAccessToken, setExpires } from '../store/slices/global';
import { updateOrder, fetchOrder as fetchOrderAction, setOrderId } from '../store/slices/cart';
import { fetchProductCollection } from '../utils/products';
import { PRODUCT_QUERY } from '../utils/content';
import { addProductCollection } from '../store/slices/products';
import { rehydration } from '../store';
import { authClient, createToken } from '../utils/auth';

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
    /* const createProductCollection = useCallback(
        async (cl: CommerceLayerClient) => {
            const stockItems = await cl.stock_items.list();
            const prices = await cl.prices.list();
            const products = await fetchProductCollection(PRODUCT_QUERY, stockItems, prices);

            dispatch(addProductCollection(products));
        },
        [dispatch]
    ); */
    // TODO: add stock item and prices function to this, call instead.
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
                const fetchedOrder = await cl.orders.retrieve(order.id, {
                    include: ['line_items', 'available_payment_methods'],
                });

                if (fetchedOrder) {
                    dispatch(updateOrder(fetchedOrder));
                }
            }
        },
        [dispatch, order]
    );

    // If order does exist then hydrate with line items.
    /* useIsomorphicLayoutEffect(() => {
        if (commerceLayer && order && shouldFetchOrder) {
            fetchOrder(commerceLayer);
            dispatch(fetchOrderAction(false));
        }
    }, [order, commerceLayer, shouldFetchOrder]); */

    // If we add something to the cart, trigger an order fetch.
    /* useIsomorphicLayoutEffect(() => {
        if (cartItems) {
            dispatch(fetchOrderAction(true));
        }
    }, [cartItems]); */

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
            createOrder(accessToken).then((orderId) => {
                if (orderId) {
                    dispatch(setOrderId(orderId));
                }
            });
        }
    }, [order, accessToken]);

    // Create the product collection on load.
    useIsomorphicLayoutEffect(() => {
        if (products.length <= 0 && accessToken) {
            getStockItems(accessToken).then((stockItems) => {
                console.log('🚀 ~ file: authProvider.tsx ~ line 115 ~ getStockItems ~ stockItems', stockItems);
                getPrices(accessToken);
            });
        }
    }, [products, accessToken]);

    // Our context value that we'll provide to the app.
    /* const contextValue = useMemo(() => {
        return commerceLayer;
    }, [commerceLayer]); */

    // const Context = AuthProviderContext;

    return children;
};

export default AuthProvider;
