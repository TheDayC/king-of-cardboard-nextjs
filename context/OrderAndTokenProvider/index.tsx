import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DateTime } from 'luxon';
import { useSession } from 'next-auth/react';

import { useIsomorphicLayoutEffect } from '../useIsomorphicLayoutEffect';
import selector from './selector';
import { fetchToken } from '../../store/slices/global';
import { createCLOrder } from '../../store/slices/cart';
import Loading from '../../components/Loading';

const OrderAndTokenProvider: React.FC = ({ children }) => {
    const { accessToken, expires, shouldCreateOrder } = useSelector(selector);
    const dispatch = useDispatch();
    const currentDate = DateTime.now().setZone('Europe/London');
    const expiryDate = DateTime.fromISO(expires || currentDate.toISO(), { zone: 'Europe/London' });
    const hasExpired = Boolean(expires && expiryDate < currentDate);
    const { status } = useSession();
    const isGuest = status !== 'authenticated';
    const shouldResetToken = !accessToken || hasExpired || localStorage.getItem('kingofcardboard-401') === 'true';

    // If accessToken doesn't exist create one.
    useIsomorphicLayoutEffect(() => {
        if (shouldResetToken) {
            dispatch(fetchToken());
            localStorage.setItem('kingofcardboard-401', 'false');
        }
    }, [shouldResetToken]);

    // If the order doesn't exist then create one.
    useIsomorphicLayoutEffect(() => {
        if (shouldCreateOrder && accessToken) {
            dispatch(createCLOrder({ accessToken, isGuest }));
        }
    }, [shouldCreateOrder, accessToken, isGuest]);

    // If we need to reset the token then show a loading screen
    if (shouldResetToken) {
        return <Loading show={true} />;
    }

    return <React.Fragment>{children}</React.Fragment>;
};

export default OrderAndTokenProvider;
