import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DateTime } from 'luxon';
import { useSession } from 'next-auth/react';

import { useIsomorphicLayoutEffect } from '../useIsomorphicLayoutEffect';
import selector from './selector';
import { fetchToken } from '../../store/slices/global';
import { createCLOrder } from '../../store/slices/cart';

const OrderAndTokenProvider: React.FC = ({ children }) => {
    const { accessToken, expires, shouldCreateOrder } = useSelector(selector);
    const dispatch = useDispatch();
    const currentDate = DateTime.now().setZone('Europe/London');
    const expiryDate = DateTime.fromISO(expires || currentDate.toISO(), { zone: 'Europe/London' });
    const hasExpired = Boolean(expires && expiryDate < currentDate);
    const { data: session } = useSession();
    const isGuest = !Boolean(session);

    // If accessToken doesn't exist create one.
    useIsomorphicLayoutEffect(() => {
        if (!accessToken || hasExpired) {
            dispatch(fetchToken());
        }
    }, [accessToken, hasExpired]);

    // If the order doesn't exist then create one.
    useIsomorphicLayoutEffect(() => {
        if (shouldCreateOrder && accessToken) {
            dispatch(createCLOrder({ accessToken, isGuest }));
        }
    }, [shouldCreateOrder, accessToken, isGuest]);

    return <React.Fragment>{children}</React.Fragment>;
};

export default OrderAndTokenProvider;
