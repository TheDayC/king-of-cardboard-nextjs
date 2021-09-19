import React, { useMemo, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DateTime } from 'luxon';
import { CommerceLayerClient } from '@commercelayer/sdk';

import AuthProviderContext from './context';
import { useIsomorphicLayoutEffect } from './useIsomorphicLayoutEffect';
import selector from './selector';
import { getCommerceAuth, initCommerceClient } from '../utils/commerce';
import { setAccessToken, setExpires } from '../store/slices/global';
import { createOrder } from '../store/slices/cart';
import { fetchProductCollection } from '../utils/products';
import { PRODUCT_QUERY } from '../utils/content';
import { addProductCollection } from '../store/slices/products';

const AuthProvider: React.FC = ({ children }) => {
    const { accessToken, expires, order } = useSelector(selector);
    const dispatch = useDispatch();

    const createNewToken = useCallback(async () => {
        const token = await getCommerceAuth();

        if (token) {
            dispatch(setAccessToken(token.accessToken));
            dispatch(setExpires(token.expires));
        }
    }, [dispatch]);

    const commerceLayer = useMemo(() => {
        // Check to see if we have a token.
        if (accessToken) {
            if (expires) {
                const expiryDate = DateTime.fromISO(expires, { zone: 'Europe/London' });
                const currentDate = DateTime.now();
                currentDate.setZone('Europe/London');

                // Check to see where our current token has expired.
                if (expiryDate < currentDate) {
                    createNewToken();

                    return null;
                }
            }

            // Our token is valid, init commerceLayer SDK.
            return initCommerceClient(accessToken);
        } else {
            // We don't have a token at all yet, create one.
            createNewToken();

            return null;
        }
    }, [accessToken, createNewToken, expires]);

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

    useIsomorphicLayoutEffect(() => {
        if (commerceLayer) {
            // Create the product collection on load.
            createProductCollection(commerceLayer);

            // If the order doesn't exist then create one.
            if (!order) {
                createNewOrder(commerceLayer);
            }
        }
    }, [accessToken, order, commerceLayer]);

    // Our context value that we'll provide to the app.
    const contextValue = useMemo(() => {
        return commerceLayer;
    }, [commerceLayer]);

    const Context = AuthProviderContext;

    return <Context.Provider value={contextValue}>{children}</Context.Provider>;
};

export default AuthProvider;
