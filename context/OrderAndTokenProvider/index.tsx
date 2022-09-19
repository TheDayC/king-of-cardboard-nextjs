import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DateTime } from 'luxon';
import { useSession } from 'next-auth/react';
import { purgeStoredState } from 'redux-persist';

import { useIsomorphicLayoutEffect } from '../useIsomorphicLayoutEffect';
import selector from './selector';
import { fetchToken } from '../../store/slices/global';
import { createCLOrder } from '../../store/slices/cart';
import { persistConfig } from '../../store';
import { calculateTokenExpiry } from '../../utils/auth';

function calculateOrderExpiry(orderExpiry: string | null): boolean {
    const currentDate = DateTime.now().setZone('Europe/London');
    const orderExpiryDate = DateTime.fromISO(orderExpiry || currentDate.toISO(), { zone: 'Europe/London' });

    if (!orderExpiry) return true;

    return orderExpiryDate < currentDate;
}

function purgeReduxPersist(): void {
    localStorage.setItem('kingofcardboard-401', 'false');
    purgeStoredState(persistConfig);
}

const OrderAndTokenProvider: React.FC = ({ children }) => {
    const { accessToken, expires, shouldCreateOrder, orderExpiry } = useSelector(selector);
    const dispatch = useDispatch();
    const { status } = useSession();
    const isGuest = status !== 'authenticated';

    // If the order doesn't exist or has expired then create one.
    useIsomorphicLayoutEffect(() => {
        const hasOrderExpired = calculateOrderExpiry(orderExpiry);

        if (accessToken) {
            if (shouldCreateOrder || hasOrderExpired) {
                purgeReduxPersist();
                dispatch(createCLOrder({ accessToken, isGuest }));
            }
        }
    }, [shouldCreateOrder, orderExpiry, accessToken, isGuest]);

    return <React.Fragment>{children}</React.Fragment>;
};

export default OrderAndTokenProvider;
