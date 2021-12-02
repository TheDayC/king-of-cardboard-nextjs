import React from 'react';

import Details from './Details';
import Profile from './Profile';
import OrderHistory from './OrderHistory';
import AchievementList from './AchievementList';
import AddressBook from './AddressBook';
import { Slugs } from '../../enums/account';

interface AccountProps {
    slug: string;
}

export const Account: React.FC<AccountProps> = ({ slug }) => {
    switch (slug) {
        case Slugs.Details:
            return <Details />;
        case Slugs.Profile:
            return <Profile />;
        case Slugs.OrderHistory:
            return <OrderHistory />;
        case Slugs.Achievements:
            return <AchievementList />;
        case Slugs.AddressBook:
            return <AddressBook />;
        default:
            return null;
    }
};

export default Account;
