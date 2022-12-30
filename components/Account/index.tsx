import React from 'react';

import Details from './Details';
import Profile from './Profile';
import AddressBook from './AddressBook';
import Fields from './AddressBook/Fields';
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
        case Slugs.AddressBook:
            return <AddressBook />;
        case Slugs.AddAddress:
            return <Fields />;
        default:
            return null;
    }
};

export default Account;
