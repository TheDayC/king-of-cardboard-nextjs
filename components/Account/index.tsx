import React from 'react';

import Details from './Details';
import Profile from './Profile';
import OrderHistory from './OrderHistory';
import AchievementList from './AchievementList';

interface AccountProps {
    slug: string;
}

export const Account: React.FC<AccountProps> = ({ slug }) => {
    switch (slug) {
        case 'details':
            return <Details />;
        case 'profile':
            return <Profile />;
        case 'orderHistory':
            return <OrderHistory />;
        case 'achievements':
            return <AchievementList />;
        default:
            return null;
    }
};

export default Account;
