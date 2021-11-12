import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useSelector } from 'react-redux';

import selector from './selector';
import { parseAsString, safelyParse } from '../../../utils/parsers';
import { getOrders } from '../../../utils/account';
import { CommerceLayerResponse } from '../../../types/api';

export const OrderHistory: React.FC = () => {
    const { accessToken } = useSelector(selector);
    const { data: session } = useSession();
    const [orders, setOrders] = useState<CommerceLayerResponse[] | null>(null);
    const emailAddress = safelyParse(session, 'user.email', parseAsString, null);

    const fetchOrderHistory = async (token: string, email: string) => {
        const response = await getOrders(token, email, 5, 1);

        if (response) {
            const { orders: responseOrders } = response;
            console.log('🚀 ~ file: index.tsx ~ line 22 ~ fetchOrderHistory ~ response', response);

            setOrders(responseOrders);
        }
    };

    useEffect(() => {
        if (accessToken && emailAddress) {
            fetchOrderHistory(accessToken, emailAddress);
        }
    }, [accessToken, emailAddress]);

    return <h1>OrderHistory</h1>;
};

export default OrderHistory;
