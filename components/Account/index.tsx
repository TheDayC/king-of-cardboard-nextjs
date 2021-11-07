import React from 'react';
import { get } from 'lodash';
import { useRouter } from 'next/router';

import Details from './Details';
import Profile from './Profile';
import OrderHistory from './OrderHistory';
import Achievements from './Achievements';

export const Account: React.FC = () => {
    const router = useRouter();
    const slug: string = get(router, 'query.slug', '');

    switch (slug) {
        case 'details':
            return <Details />;
        case 'profile':
            return <Profile />;
        case 'orderHistory':
            return <OrderHistory />;
        case 'achievements':
            return <Achievements />;
        default:
            return null;
    }
};

export default Account;
