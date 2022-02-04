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
    const session = useSession();
    const isGuest = !Boolean(session && session.status === 'authenticated');
    const shouldResetToken = localStorage.getItem('kingofcardboard-401');

    // If accessToken doesn't exist create one.
    useIsomorphicLayoutEffect(() => {
        if (!accessToken || hasExpired || shouldResetToken === 'true') {
            dispatch(fetchToken());
            localStorage.setItem('kingofcardboard-401', 'false');
        }
    }, [accessToken, hasExpired, shouldResetToken]);

    // If the order doesn't exist then create one.
    useIsomorphicLayoutEffect(() => {
        if (shouldCreateOrder && accessToken) {
            dispatch(createCLOrder({ accessToken, isGuest }));
        }
    }, [shouldCreateOrder, accessToken, isGuest]);

    // If the access token exists create an order.
    useIsomorphicLayoutEffect(() => {
        if (shouldCreateOrder && accessToken) {
            dispatch(createCLOrder({ accessToken, isGuest }));
        }
    }, [shouldCreateOrder, accessToken, isGuest]);

    return <React.Fragment>{children}</React.Fragment>;
};

export default OrderAndTokenProvider;
